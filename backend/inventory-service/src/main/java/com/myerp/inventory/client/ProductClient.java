package com.myerp.inventory.client;

import com.myerp.inventory.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// name = "product-service" must match the application name of the product service in Eureka
@FeignClient(name = "product-service")
public interface ProductClient {

    @GetMapping("/products/{id}")
    ProductDto getProductById(@PathVariable("id") Long id);
}
