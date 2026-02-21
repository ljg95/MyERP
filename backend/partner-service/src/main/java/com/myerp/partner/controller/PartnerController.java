package com.myerp.partner.controller;

import com.myerp.partner.dto.PartnerDto;
import com.myerp.partner.service.PartnerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/partners")
public class PartnerController {

    private final PartnerService partnerService;

    public PartnerController(PartnerService partnerService) {
        this.partnerService = partnerService;
    }

    @GetMapping
    public ResponseEntity<Page<PartnerDto>> getPartners(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<PartnerDto> partners = partnerService.getPartners(keyword, type, pageable);
        return ResponseEntity.ok(partners);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartnerDto> getPartnerById(@PathVariable Long id) {
        return ResponseEntity.ok(partnerService.getPartnerById(id));
    }

    @PostMapping
    public ResponseEntity<PartnerDto> createPartner(@RequestBody PartnerDto partnerDto) {
        PartnerDto created = partnerService.createPartner(partnerDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PartnerDto> updatePartner(@PathVariable Long id, @RequestBody PartnerDto partnerDto) {
        return ResponseEntity.ok(partnerService.updatePartner(id, partnerDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePartner(@PathVariable Long id) {
        partnerService.deletePartner(id);
        return ResponseEntity.noContent().build();
    }
}
