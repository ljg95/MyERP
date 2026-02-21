package com.myerp.inventory.controller;

import com.myerp.inventory.dto.InventoryResponseDto;
import com.myerp.inventory.dto.StockAdjustmentRequest;
import com.myerp.inventory.model.InventoryHistory;
import com.myerp.inventory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public Page<InventoryResponseDto> getInventories(@PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return inventoryService.getAllInventories(pageable);
    }

    @PostMapping("/adjust")
    public ResponseEntity<Void> adjustStock(@RequestBody StockAdjustmentRequest request) {
        inventoryService.adjustStock(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{productId}")
    public ResponseEntity<InventoryResponseDto> getInventory(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getInventoryByProductId(productId));
    }

    @GetMapping("/history")
    public Page<InventoryHistory> getInventoryHistory(
            @RequestParam(required = false) Long productId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return inventoryService.getInventoryHistories(productId, pageable);
    }
}
