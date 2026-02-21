package com.myerp.inventory.repository;

import com.myerp.inventory.model.InventoryHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryHistoryRepository extends JpaRepository<InventoryHistory, Long> {
    Page<InventoryHistory> findByProductId(Long productId, Pageable pageable);

    Page<InventoryHistory> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
