package com.myerp.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

@FeignClient(name = "inventory-service")
public interface InventoryClient {
    @PostMapping("/inventory/adjust")
    void adjustStock(@RequestBody Map<String, Object> request);
}
