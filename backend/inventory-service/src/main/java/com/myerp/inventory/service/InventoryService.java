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

/**
 * InventoryService
 * 재고 관리 비즈니스 로직을 담당하는 서비스 클래스입니다.
 * 재고의 증감(입/출고), 현재 재고 현황 조회, 재고 이력 저장 기능을 제공합니다.
 * ProductClient를 통해 Product 서비스에서 상품의 이름 등 메타데이터를 가져옵니다.
 */
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

    /**
     * 외부 요청(주문 생성 등) 또는 수동 조정에 의해 재고를 변경하고 이력을 기록합니다.
     *
     * @param request 재고 조정 요청 정보 (상품 ID, 변경 수량, 사유 등)
     */
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

    /**
     * 상품별 재고 증감 이력(History)을 페이징하여 조회합니다.
     *
     * @param productId 특정 상품의 이력만 볼 경우의 상품 ID (null이면 전체 조회)
     * @param pageable  페이징 정보
     * @return 페이징된 재고 이력 엔티티 목록
     */
    public Page<InventoryHistory> getInventoryHistories(Long productId, Pageable pageable) {
        if (productId != null) {
            return inventoryHistoryRepository.findByProductId(productId, pageable);
        }
        return inventoryHistoryRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
}
