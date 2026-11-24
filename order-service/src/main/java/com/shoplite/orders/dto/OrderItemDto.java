package com.shoplite.orders.dto;

import java.math.BigDecimal;

public class OrderItemDto {
    private Long productId;
    private String sku;
    private String name;
    private Integer quantity;
    private BigDecimal price;

    public OrderItemDto() {}

    public OrderItemDto(Long productId, String sku, String name, Integer quantity, BigDecimal price) {
        this.productId = productId;
        this.sku = sku;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
