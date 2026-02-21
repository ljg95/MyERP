package com.myerp.inventory.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * InventoryHistory
 * 재고 수량의 증감 내역(입고, 출고, 재고 보정 등)을 기록하는 로그 결속성 JPA Entity 클래스입니다.
 * DB의 'inventory_histories' 테이블과 매핑되며, 재고 변동 내역의 감사(Audit) 및 이력 추적을 위해
 * 한 번 기록된 데이터는 수정(Update)되지 않고 지속해서 쌓이는 형태(Append-Only)로 설계되었습니다.
 */
@Entity
@Table(name = "inventory_histories")
public class InventoryHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(name = "quantity_changed", nullable = false)
    private Integer quantityChanged; // e.g., +10, -5

    @Column(nullable = false, length = 20)
    private String type; // INBOUND, OUTBOUND, ADJUSTMENT, INIT

    @Column(length = 255)
    private String reason; // "Initial stock", "Order #123", "Found missing items", etc.

    @Column(name = "reference_id", length = 50)
    private String referenceId; // order ID, etc.

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantityChanged() {
        return quantityChanged;
    }

    public void setQuantityChanged(Integer quantityChanged) {
        this.quantityChanged = quantityChanged;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
