package com.myerp.partner.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Partner
 * Partner 엔티티
 * 거래처(공급사, 고객사, 물류 등)의 핵심 정보를 저장하는 DB 테이블과 매핑됩니다.
 * Soft Delete 설정을 통해 삭제 시 실제 DB 레코드를 지우지 않고 deleted_at 필드만 업데이트합니다.
 */
@Entity
@Table(name = "partners")
@SQLDelete(sql = "UPDATE partners SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
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
