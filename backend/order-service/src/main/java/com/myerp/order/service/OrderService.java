package com.myerp.order.service;

import com.myerp.order.client.InventoryClient;
import com.myerp.order.client.PartnerClient;
import com.myerp.order.client.ProductClient;
import com.myerp.order.dto.OrderDto;
import com.myerp.order.dto.OrderItemDto;
import com.myerp.order.dto.OrderRequest;
import com.myerp.order.model.Order;
import com.myerp.order.model.OrderItem;
import com.myerp.order.repository.OrderItemRepository;
import com.myerp.order.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductClient productClient;
    private final PartnerClient partnerClient;
    private final InventoryClient inventoryClient;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
            ProductClient productClient, PartnerClient partnerClient, InventoryClient inventoryClient) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productClient = productClient;
        this.partnerClient = partnerClient;
        this.inventoryClient = inventoryClient;
    }

    @Transactional
    public OrderDto createOrder(OrderRequest request) {
        // Validate Partner
        Map<String, Object> partnerData;
        try {
            partnerData = partnerClient.getPartnerById(request.getPartnerId());
        } catch (Exception e) {
            throw new RuntimeException("해당 파트너(거래처)를 찾을 수 없거나 서비스에 연결할 수 없습니다. ID: " + request.getPartnerId());
        }

        Order order = new Order();
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setPartnerId(request.getPartnerId());
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus("PENDING");

        // Save order earlier to get ID for items
        Order savedOrder = orderRepository.save(order);
        BigDecimal totalAmount = BigDecimal.ZERO;

        List<OrderItem> items = new ArrayList<>();
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Map<String, Object> productData;
            try {
                productData = productClient.getProductById(itemReq.getProductId());
            } catch (Exception e) {
                throw new RuntimeException("해당 상품을 찾을 수 없거나 서비스에 연결할 수 없습니다. ID: " + itemReq.getProductId());
            }

            Double priceDouble = (Double) productData.get("price");
            BigDecimal unitPrice = BigDecimal.valueOf(priceDouble);
            BigDecimal subTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem item = new OrderItem();
            item.setOrderId(savedOrder.getId());
            item.setProductId(itemReq.getProductId());
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(unitPrice);
            item.setSubTotal(subTotal);

            items.add(item);
            totalAmount = totalAmount.add(subTotal);

            // Optionally reduce inventory stock right away via InventoryService
            try {
                Map<String, Object> adjustReq = new HashMap<>();
                adjustReq.put("productId", itemReq.getProductId());
                adjustReq.put("quantity", -itemReq.getQuantity()); // Deduct stock
                adjustReq.put("adjustmentType", "OUTBOUND");
                adjustReq.put("reason", "Order Created: " + savedOrder.getOrderNumber());
                adjustReq.put("referenceId", savedOrder.getId().toString());

                inventoryClient.adjustStock(adjustReq);
            } catch (Exception e) {
                System.err.println("경고: 재고 차감 요청 실패 - " + e.getMessage());
                // Depending on business logic, we might fail the order or just proceed with
                // risk
            }
        }

        orderItemRepository.saveAll(items);
        savedOrder.setTotalAmount(totalAmount);
        orderRepository.save(savedOrder);

        return convertToDto(savedOrder, items, (String) partnerData.get("name"));
    }

    @Transactional(readOnly = true)
    public Page<OrderDto> getOrders(String orderNumberKeyword, Pageable pageable) {
        Page<Order> orders;
        if (orderNumberKeyword != null && !orderNumberKeyword.trim().isEmpty()) {
            orders = orderRepository.findByOrderNumberContainingIgnoreCase(orderNumberKeyword, pageable);
        } else {
            orders = orderRepository.findAll(pageable);
        }
        return orders.map(this::convertToDtoLight);
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다. ID: " + id));
        List<OrderItem> items = orderItemRepository.findByOrderId(id);

        String partnerName = "알 수 없는 거래처";
        try {
            Map<String, Object> partnerData = partnerClient.getPartnerById(order.getPartnerId());
            if (partnerData != null && partnerData.get("name") != null) {
                partnerName = (String) partnerData.get("name");
            }
        } catch (Exception e) {
        }

        return convertToDto(order, items, partnerName);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다. ID: " + id));
        order.setStatus(status);
        orderRepository.save(order);
        return getOrderById(id);
    }

    private OrderDto convertToDtoLight(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setPartnerId(order.getPartnerId());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }

    private OrderDto convertToDto(Order order, List<OrderItem> items, String partnerName) {
        OrderDto dto = convertToDtoLight(order);
        dto.setPartnerName(partnerName);

        List<OrderItemDto> itemDtos = items.stream().map(item -> {
            OrderItemDto iDto = new OrderItemDto();
            iDto.setId(item.getId());
            iDto.setOrderId(item.getOrderId());
            iDto.setProductId(item.getProductId());
            iDto.setQuantity(item.getQuantity());
            iDto.setUnitPrice(item.getUnitPrice());
            iDto.setSubTotal(item.getSubTotal());

            // Enrich product name
            try {
                Map<String, Object> pData = productClient.getProductById(item.getProductId());
                if (pData != null && pData.get("name") != null) {
                    iDto.setProductName((String) pData.get("name"));
                }
            } catch (Exception e) {
                iDto.setProductName("알 수 없는 상품");
            }
            return iDto;
        }).collect(Collectors.toList());

        dto.setItems(itemDtos);
        return dto;
    }
}
