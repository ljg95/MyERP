package com.myerp.product.service;

import com.myerp.product.dto.ProductDto;
import com.myerp.product.model.Product;
import com.myerp.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Entity to Dto converter
    private ProductDto convertToDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getCategory(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getStatus(),
                product.getCreatedAt(),
                product.getUpdatedAt());
    }

    // Dto to Entity converter
    private Product convertToEntity(ProductDto dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setSku(dto.getSku());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity() != null ? dto.getStockQuantity() : 0);
        product.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        return product;
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<ProductDto> getProducts(String keyword, String category, String status,
            org.springframework.data.domain.Pageable pageable) {

        // "모든 카테고리" 또는 "모든 상태"가 넘어왔을 경우 null로 처리하여 필터 우회
        String searchCategory = (category != null && !category.trim().isEmpty() && !category.contains("모든"))
                ? category.trim()
                : null;
        String searchStatus = (status != null && !status.trim().isEmpty() && !status.contains("모든")) ? status.trim()
                : null;
        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        org.springframework.data.domain.Page<Product> productPage = productRepository.searchProducts(
                searchKeyword, searchCategory, searchStatus, pageable);

        return productPage.map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return convertToDto(product);
    }

    @Transactional
    public ProductDto createProduct(ProductDto productDto) {
        if (productRepository.existsBySku(productDto.getSku())) {
            throw new RuntimeException("Product already exists with SKU: " + productDto.getSku());
        }
        Product product = convertToEntity(productDto);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Update fields if they are provided
        if (productDetails.getName() != null)
            product.setName(productDetails.getName());
        if (productDetails.getCategory() != null)
            product.setCategory(productDetails.getCategory());
        if (productDetails.getPrice() != null)
            product.setPrice(productDetails.getPrice());
        if (productDetails.getStockQuantity() != null)
            product.setStockQuantity(productDetails.getStockQuantity());
        if (productDetails.getStatus() != null)
            product.setStatus(productDetails.getStatus());

        // Note: SKU is usually not updated after creation.

        Product updatedProduct = productRepository.save(product);
        return convertToDto(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
