package com.myerp.partner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class PartnerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PartnerApplication.class, args);
    }
}
