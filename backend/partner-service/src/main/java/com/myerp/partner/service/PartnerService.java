package com.myerp.partner.service;

import com.myerp.partner.dto.PartnerDto;
import com.myerp.partner.model.Partner;
import com.myerp.partner.repository.PartnerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PartnerService {

    private final PartnerRepository partnerRepository;

    public PartnerService(PartnerRepository partnerRepository) {
        this.partnerRepository = partnerRepository;
    }

    @Transactional(readOnly = true)
    public Page<PartnerDto> getPartners(String keyword, String type, Pageable pageable) {
        Page<Partner> partners;

        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();
        boolean hasType = type != null && !type.trim().isEmpty() && !type.equals("All");

        if (hasKeyword && hasType) {
            partners = partnerRepository.findByNameContainingIgnoreCaseAndType(keyword, type, pageable);
        } else if (hasKeyword) {
            partners = partnerRepository.findByNameContainingIgnoreCase(keyword, pageable);
        } else if (hasType) {
            partners = partnerRepository.findByType(type, pageable);
        } else {
            partners = partnerRepository.findAll(pageable);
        }

        return partners.map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public PartnerDto getPartnerById(Long id) {
        return partnerRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new RuntimeException("거래처를 찾을 수 없습니다."));
    }

    @Transactional
    public PartnerDto createPartner(PartnerDto dto) {
        Partner partner = new Partner();
        updateEntityFromDto(partner, dto);
        Partner saved = partnerRepository.save(partner);
        return convertToDto(saved);
    }

    @Transactional
    public PartnerDto updatePartner(Long id, PartnerDto dto) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("거래처를 찾을 수 없습니다."));
        updateEntityFromDto(partner, dto);
        Partner updated = partnerRepository.save(partner);
        return convertToDto(updated);
    }

    @Transactional
    public void deletePartner(Long id) {
        if (!partnerRepository.existsById(id)) {
            throw new RuntimeException("거래처를 찾을 수 없습니다.");
        }
        // Soft delete 작동 (@SQLDelete)
        partnerRepository.deleteById(id);
    }

    private PartnerDto convertToDto(Partner partner) {
        PartnerDto dto = new PartnerDto();
        dto.setId(partner.getId());
        dto.setName(partner.getName());
        dto.setType(partner.getType());
        dto.setContactPerson(partner.getContactPerson());
        dto.setEmail(partner.getEmail());
        dto.setPhone(partner.getPhone());
        dto.setAddress(partner.getAddress());
        dto.setStatus(partner.getStatus());
        dto.setCreatedAt(partner.getCreatedAt());
        dto.setUpdatedAt(partner.getUpdatedAt());
        return dto;
    }

    private void updateEntityFromDto(Partner partner, PartnerDto dto) {
        partner.setName(dto.getName());
        partner.setType(dto.getType());
        partner.setContactPerson(dto.getContactPerson());
        partner.setEmail(dto.getEmail());
        partner.setPhone(dto.getPhone());
        partner.setAddress(dto.getAddress());
        // 새 데이터일 경우 기본 status 지정
        partner.setStatus(dto.getStatus() != null ? dto.getStatus() : "Active");
    }
}
