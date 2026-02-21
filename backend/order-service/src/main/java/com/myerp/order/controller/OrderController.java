package com.myerp.order.controller;

import com.myerp.order.dto.OrderDto;
import com.myerp.order.dto.OrderRequest;
import com.myerp.order.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "Order Service is up and running!";
    }

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderRequest request) {
        return new ResponseEntity<>(orderService.createOrder(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<OrderDto>> getOrders(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(orderService.getOrders(keyword, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
