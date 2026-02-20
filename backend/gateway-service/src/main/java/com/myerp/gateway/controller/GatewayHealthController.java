package com.myerp.gateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GatewayHealthController {

    @GetMapping("/")
    public String healthCheck() {
        return "Gateway Service is up and running! (Port: 8080)";
    }
}
