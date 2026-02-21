package com.myerp.inventory.model;

import jakarta.persistence.*;

/**
 * Inventory
 * 특정 상품의 "현재 재고 수량 원장"을 관리하는 JPA Entity 클래스입니다.
 * DB의 'inventories' 테이블과 매핑되며, 각 상품(productId)당 하나의 레코드만 존재하여
 * 최종 재고 상태(quantity)를 지속해서 추적 및 갱신합니다.
 */
/**
 * Inventory 엔티티
 * 개별 상품(productId)에 대한 총 가용 재고(quantity)와 최소 유지 재고(minStock)를 관리합니다.
 * 상품 데이터 자체는 Product Service에 있으므로 productId만을 외래키 개념으로 가집니다.
 */
@Entity
@Table(name = "inventories")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long productId;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(name = "min_stock", nullable = false)
    private Integer minStock = 10;

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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getMinStock() {
        return minStock;
    }

    public void setMinStock(Integer minStock) {
        this.minStock = minStock;
    }
}
