package com.shoplite.orders;

import com.shoplite.orders.dto.OrderResponseDto;
import com.shoplite.orders.entity.Order;
import com.shoplite.orders.repository.OrderRepository;
import com.shoplite.orders.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class OrderServiceApplicationTests {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
    }

    @Test
    void contextLoads() {
        assertNotNull(orderService);
        assertNotNull(orderRepository);
    }

    @Test
    void testCreateAndRetrieveOrder() {
        Order order = new Order("ORD-9001", "Alice Smith", "alice@example.com", BigDecimal.valueOf(350.00), "Processing");
        orderRepository.save(order);

        List<OrderResponseDto> orders = orderService.getAllOrders();
        assertEquals(1, orders.size());
        assertEquals("ORD-9001", orders.get(0).getId());
        assertEquals("Alice Smith", orders.get(0).getCustomer().get("name"));
    }

    @Test
    void testUpdateOrderStatus() {
        Order order = new Order("ORD-9002", "Bob Jones", "bob@example.com", BigDecimal.valueOf(120.00), "Pending");
        orderRepository.save(order);

        Optional<OrderResponseDto> updated = orderService.updateOrderStatus("ORD-9002", "Delivered");
        assertTrue(updated.isPresent());
        assertEquals("Delivered", updated.get().getStatus());
    }

    @Test
    void testOrderNotFound() {
        Optional<OrderResponseDto> result = orderService.getOrderByIdOrNumber("ORD-NONEXISTENT");
        assertTrue(result.isEmpty());
    }
}
