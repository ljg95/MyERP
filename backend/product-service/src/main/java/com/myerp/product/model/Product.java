package com.myerp.product.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Product
 * ERP 시스템의 상품(품목) 정보를 저장하는 JPA Entity 클래스입니다.
 * DB의 'products' 테이블과 매핑되며, 재고 관리 등 다른 서비스의 기준 정보가 됩니다.
 * 
 * Soft Delete (논리적 삭제) 기능이 적용되어 있어, 삭제 시 실제 데이터가 지워지지 않고
 * 'deleted' 컬럼이 true로 업데이트됩니다. (@SQLDelete, @SQLRestriction 활용)
 */
@Entity
@Table(name = "products")
@org.hibernate.annotations.SQLDelete(sql = "UPDATE products SET deleted = true WHERE id = ?")
@org.hibernate.annotations.SQLRestriction("deleted = false") // 일반 조회 시 삭제된 데이터 필터링
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String sku; // 재고 관리 코드

    private String category;

    @Column(nullable = false)
    private BigDecimal price;

    private Integer stockQuantity = 0; // 초기 재고

    private String status; // Active, Inactive

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Column(name = "deleted", columnDefinition = "boolean default false")
    private boolean deleted = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
