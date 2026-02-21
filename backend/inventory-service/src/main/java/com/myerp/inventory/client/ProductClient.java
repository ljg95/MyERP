package com.myerp.inventory.client;

import com.myerp.inventory.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * ProductClient
 * Spring Cloud OpenFeign을 사용하여 Product Service와 통신하는 인터페이스입니다.
 * Eureka Service Discovery를 통해 "product-service"라는 이름의 인스턴스를 찾아 동적으로 요청을
 * 라우팅합니다.
 * 이를 통해 복잡한 HTTP 통신 코드 없이 메서드 호출만으로 타 마이크로서비스의 API를 사용할 수 있습니다.
 */
@FeignClient(name = "product-service")
public interface ProductClient {

    /**
     * 상품 ID를 기반으로 상품 상세 정보를 조회합니다.
     * 실제로는 GET http://product-service/products/{id} 로 HTTP 요청이 전송됩니다.
     * 
     * @param id 조회할 상품의 고유 ID
     * @return ProductDto 외부 서비스에서 응답받은 JSON 데이터를 자바 객체로 변환하여 반환
     */
    @GetMapping("/products/{id}")
    ProductDto getProductById(@PathVariable("id") Long id);
}
