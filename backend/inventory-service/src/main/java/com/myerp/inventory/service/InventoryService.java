package com.myerp.inventory.service;

import com.myerp.inventory.client.ProductClient;
import com.myerp.inventory.dto.InventoryResponseDto;
import com.myerp.inventory.dto.ProductDto;
import com.myerp.inventory.dto.StockAdjustmentRequest;
import com.myerp.inventory.model.Inventory;
import com.myerp.inventory.model.InventoryHistory;
import com.myerp.inventory.repository.InventoryHistoryRepository;
import com.myerp.inventory.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryHistoryRepository inventoryHistoryRepository;

    @Autowired
    private ProductClient productClient;

    public Page<InventoryResponseDto> getAllInventories(Pageable pageable) {
        Page<Inventory> inventories = inventoryRepository.findAll(pageable);

        List<InventoryResponseDto> dtoList = inventories.getContent().stream().map(inv -> {
            InventoryResponseDto dto = new InventoryResponseDto();
            dto.setId(inv.getId());
            dto.setProductId(inv.getProductId());
            dto.setQuantity(inv.getQuantity());
            dto.setMinStock(inv.getMinStock());

            // Fetch Product Info using Feign Client
            try {
                ProductDto product = productClient.getProductById(inv.getProductId());
                if (product != null) {
                    dto.setProductName(product.getName());
                    dto.setProductCategory(product.getCategory());
                } else {
                    dto.setProductName("Unknown Product");
                }
            } catch (Exception e) {
                // Feign client might throw exception if product not found (404) or service down
                dto.setProductName("Product Not Found");
                dto.setProductCategory("N/A");
            }
            return dto;
        }).collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, inventories.getTotalElements());
    }

    @Transactional
    public void adjustStock(StockAdjustmentRequest request) {
        Long productId = request.getProductId();
        int changed = request.getQuantityChanged();

        // 1. Update or Create Inventory Record
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> {
                    Inventory newInv = new Inventory();
                    newInv.setProductId(productId);
                    newInv.setQuantity(0);
                    newInv.setMinStock(10); // default min stock
                    return newInv;
                });

        inventory.setQuantity(inventory.getQuantity() + changed);
        inventoryRepository.save(inventory);

        // 2. Log History
        InventoryHistory history = new InventoryHistory();
        history.setProductId(productId);
        history.setQuantityChanged(changed);
        history.setReason(request.getReason());
        history.setReferenceId(request.getReferenceId());

        if (changed > 0) {
            history.setType("INBOUND");
        } else if (changed < 0) {
            history.setType("OUTBOUND");
        } else {
            history.setType("ADJUSTMENT");
        }

        inventoryHistoryRepository.save(history);
    }

    public InventoryResponseDto getInventoryByProductId(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> {
                    Inventory newInv = new Inventory();
                    newInv.setProductId(productId);
                    newInv.setQuantity(0);
                    newInv.setMinStock(10);
                    return newInv;
                });

        InventoryResponseDto dto = new InventoryResponseDto();
        dto.setId(inventory.getId());
        dto.setProductId(inventory.getProductId());
        dto.setQuantity(inventory.getQuantity());
        dto.setMinStock(inventory.getMinStock());

        try {
            ProductDto product = productClient.getProductById(productId);
            if (product != null) {
                dto.setProductName(product.getName());
                dto.setProductCategory(product.getCategory());
            } else {
                dto.setProductName("Unknown Product");
            }
        } catch (Exception e) {
            dto.setProductName("Product Not Found");
            dto.setProductCategory("N/A");
        }
        return dto;
    }

    public Page<InventoryHistory> getInventoryHistories(Long productId, Pageable pageable) {
        if (productId != null) {
            return inventoryHistoryRepository.findByProductId(productId, pageable);
        }
        return inventoryHistoryRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
}
