package com.shoplite.orders.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping({"/health", "/api/health"})
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "shoplite-order-service");
        response.put("timestamp", Instant.now().toString());
        response.put("version", "1.0.0");

        String dbStatus = "connected";
        try (Connection conn = dataSource.getConnection()) {
            if (!conn.isValid(2)) {
                dbStatus = "disconnected";
            }
        } catch (Exception e) {
            dbStatus = "disconnected";
        }

        response.put("database", dbStatus);
        response.put("status", "connected".equals(dbStatus) ? "healthy" : "degraded");

        return ResponseEntity.ok(response);
    }
}
