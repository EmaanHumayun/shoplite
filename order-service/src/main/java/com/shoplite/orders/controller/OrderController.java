package com.shoplite.orders.controller;

import com.shoplite.orders.dto.OrderResponseDto;
import com.shoplite.orders.dto.UpdateStatusRequest;
import com.shoplite.orders.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping({"/orders", "/api/orders"})
    public ResponseEntity<List<OrderResponseDto>> getOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping({"/orders/{id}", "/api/orders/{id}"})
    public ResponseEntity<?> getOrderById(@PathVariable("id") String id) {
        return orderService.getOrderByIdOrNumber(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body((OrderResponseDto) null));
    }

    @PatchMapping({"/orders/{id}/status", "/api/orders/{id}/status"})
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable("id") String id,
            @Valid @RequestBody UpdateStatusRequest request) {
        return orderService.updateOrderStatus(id, request.getStatus())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body((OrderResponseDto) null));
    }
}
