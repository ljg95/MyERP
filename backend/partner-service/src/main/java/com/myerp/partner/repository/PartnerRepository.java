package com.myerp.partner.repository;

import com.myerp.partner.model.Partner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PartnerRepository extends JpaRepository<Partner, Long> {

    // 거래처명과 거래처 유형으로 동시 부분 검색 (대소문자 무시)
    Page<Partner> findByNameContainingIgnoreCaseAndType(String name, String type, Pageable pageable);

    // 거래처명만 부분 검색
    Page<Partner> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // 유형만 필터링
    Page<Partner> findByType(String type, Pageable pageable);
}
