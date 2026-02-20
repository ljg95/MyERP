package com.myerp.product.repository;

import com.myerp.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsBySku(String sku);

    // 통합 검색 쿼리: 상품명 부분 일치, 카테고리 일치, 상태 일치 (페이징 지원)
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR :name = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:category IS NULL OR :category = '' OR p.category = :category) AND " +
            "(:status IS NULL OR :status = '' OR p.status = :status)")
    org.springframework.data.domain.Page<Product> searchProducts(
            @org.springframework.data.repository.query.Param("name") String name,
            @org.springframework.data.repository.query.Param("category") String category,
            @org.springframework.data.repository.query.Param("status") String status,
            org.springframework.data.domain.Pageable pageable);
}
