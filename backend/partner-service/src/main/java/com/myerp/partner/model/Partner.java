package com.myerp.partner.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Partner
 * 공급사, 고객사, 물류 파트너 등 거래처 정보를 저장하는 JPA Entity 클래스입니다.
 * DB의 'partners' 테이블과 매핑됩니다.
 * 
 * Soft Delete (논리적 삭제) 기능이 적용되어 있어, 삭제 시 실제 데이터가 지워지지 않고
 * 'deleted' 컬럼이 true로 업데이트됩니다. (@SQLDelete, @SQLRestriction 활용)
 */
@Entity
@Table(name = "partners")
@org.hibernate.annotations.SQLDelete(sql = "UPDATE partners SET deleted = true WHERE id = ?")
@org.hibernate.annotations.SQLRestriction("deleted = false") // 일반 조회 시 삭제된 데이터는 자동 필터링됨
public class Partner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // Supplier, Customer, Logistics

    private String contactPerson;
    private String email;
    private String phone;
    private String address;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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
