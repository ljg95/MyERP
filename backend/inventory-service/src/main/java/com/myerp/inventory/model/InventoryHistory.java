package com.myerp.inventory.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

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
