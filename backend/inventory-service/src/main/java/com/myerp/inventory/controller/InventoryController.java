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

/**
 * InventoryController
 * 외부(Frontend 또는 타 서비스)로부터 들어오는 재고 관련 HTTP 요청을 핸들링합니다.
 * Gateway Service를 거쳐 "/inventory/**" 형태의 경로로 들어온 요청이 이곳으로 라우팅됩니다.
 */
@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    /**
     * 전체 재고 현황을 페이징하여 조회합니다. (대시보드 또는 목록 화면용)
     */
    @GetMapping
    public Page<InventoryResponseDto> getInventories(@PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return inventoryService.getAllInventories(pageable);
    }

    /**
     * 입고, 출고, 재고 보조 등 수량 변동 이벤트를 받아 처리합니다.
     */
    @PostMapping("/adjust")
    public ResponseEntity<Void> adjustStock(@RequestBody StockAdjustmentRequest request) {
        inventoryService.adjustStock(request);
        return ResponseEntity.ok().build();
    }

    /**
     * 특정 상품에 대한 단건 재고 정보를 조회합니다. (조정 폼 초기 값 로드용)
     */
    @GetMapping("/{productId}")
    public ResponseEntity<InventoryResponseDto> getInventory(@PathVariable Long productId) {
        return ResponseEntity.ok(inventoryService.getInventoryByProductId(productId));
    }

    /**
     * 재고 증감 로그(History)를 최신순으로 페이징하여 조회합니다.
     * productId가 파라미터로 제공될 경우 특정 상품의 이력만 필터링합니다.
     */
    @GetMapping("/history")
    public Page<InventoryHistory> getInventoryHistory(
            @RequestParam(required = false) Long productId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return inventoryService.getInventoryHistories(productId, pageable);
    }
}
