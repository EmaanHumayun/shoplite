package com.shoplite.orders.service;

import com.shoplite.orders.dto.OrderItemDto;
import com.shoplite.orders.dto.OrderResponseDto;
import com.shoplite.orders.entity.Order;
import com.shoplite.orders.entity.OrderItem;
import com.shoplite.orders.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<OrderResponseDto> getOrderByIdOrNumber(String identifier) {
        // Try finding by orderNumber first (e.g. "ORD-8941")
        Optional<Order> orderOpt = orderRepository.findByOrderNumber(identifier);
        if (orderOpt.isPresent()) {
            return orderOpt.map(this::mapToDto);
        }

        // Try parsing as numeric database ID
        try {
            Long id = Long.parseLong(identifier);
            return orderRepository.findById(id).map(this::mapToDto);
        } catch (NumberFormatException ignored) {
            return Optional.empty();
        }
    }

    @Transactional
    public Optional<OrderResponseDto> updateOrderStatus(String identifier, String newStatus) {
        Optional<Order> orderOpt = orderRepository.findByOrderNumber(identifier);
        if (orderOpt.isEmpty()) {
            try {
                Long id = Long.parseLong(identifier);
                orderOpt = orderRepository.findById(id);
            } catch (NumberFormatException ignored) {
                return Optional.empty();
            }
        }

        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(newStatus);
            Order updated = orderRepository.save(order);
            return Optional.of(mapToDto(updated));
        }

        return Optional.empty();
    }

    public OrderResponseDto mapToDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getOrderNumber());
        dto.setNumericId(order.getId());

        Map<String, String> customer = new HashMap<>();
        customer.put("name", order.getCustomerName());
        customer.put("email", order.getCustomerEmail());
        dto.setCustomer(customer);

        dto.setDate(order.getCreatedAt());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());

        BigDecimal total = order.getTotalAmount();
        BigDecimal subtotal = total.divide(BigDecimal.valueOf(1.08), 2, RoundingMode.HALF_UP);
        BigDecimal tax = total.subtract(subtotal);

        dto.setTotal(total);
        dto.setSubtotal(subtotal);
        dto.setTax(tax);
        dto.setShipping(BigDecimal.ZERO);

        List<OrderItemDto> itemDtos = order.getItems().stream().map(item -> new OrderItemDto(
                item.getProductId(),
                item.getSku(),
                item.getName(),
                item.getQuantity(),
                item.getUnitPrice()
        )).collect(Collectors.toList());

        dto.setItems(itemDtos);
        return dto;
    }
}
