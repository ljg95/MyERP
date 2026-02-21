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

/**
 * OrderService
 * 주문 생성, 조회 및 상태 변경을 담당하는 비즈니스 로직 클래스입니다.
 * Product, Partner, Inventory 서비스와 OpenFeign을 통해 통신하여 주문 가능 여부 및 재고 차감을 처리합니다.
 */
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

    /**
     * 새로운 주문을 생성합니다.
     * 1. PartnerClient를 통해 고객 유효성 검증
     * 2. ProductClient를 통해 상품 단가 조회 및 총액 계산
     * 3. InventoryClient를 통해 재고 차감 (OUTBOUND)
     * 4. 데이터베이스에 Order 및 OrderItem 저장
     *
     * @param request 주문 요청 데이터 (고객 ID, 배송지, 상품 목록 등)
     * @return 생성된 주문 정보 DTO
     */
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

    /**
     * 조건에 맞는 주문 목록을 페이징하여 조회합니다.
     * 키워드가 제공된 경우 주문 번호를 기준으로 검색합니다.
     *
     * @param orderNumberKeyword 검색할 주문 번호 키워드
     * @param pageable           페이징 및 정렬 정보
     * @return 페이징된 주문 DTO 목록
     */
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

    /**
     * 특정 주문의 상세 정보를 조회합니다.
     * FeignClient를 사용해 파트너(고객) 이름과 각 품목의 상품명을 함께 조회하여 응답에 포함시킵니다.
     *
     * @param id 주문 ID
     * @return 조회된 주문 상세 정보 DTO
     */
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

    /**
     * 주문의 상태(예: 배송 중, 완료, 취소 등)를 변경합니다.
     *
     * @param id     주문 ID
     * @param status 변경할 상태 값
     * @return 상태가 변경된 주문 정보 DTO
     */
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
