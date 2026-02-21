package com.myerp.inventory.dto;

import java.time.LocalDateTime;

public class InventoryResponseDto {
    private Long id;
    private Long productId;
    private String productName; // Fetched via Feign
    private String productCategory; // Fetched via Feign
    private Integer quantity;
    private Integer minStock;
    private String status; // NORMAL, LOW_STOCK, OUT_OF_STOCK

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

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        updateStatus();
    }

    public Integer getMinStock() {
        return minStock;
    }

    public void setMinStock(Integer minStock) {
        this.minStock = minStock;
        updateStatus();
    }

    public String getStatus() {
        return status;
    }

    private void updateStatus() {
        if (this.quantity == null || this.minStock == null)
            return;
        if (this.quantity <= 0) {
            this.status = "OUT_OF_STOCK";
        } else if (this.quantity <= this.minStock) {
            this.status = "LOW_STOCK";
        } else {
            this.status = "NORMAL";
        }
    }
}
