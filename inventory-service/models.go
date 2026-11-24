package main

import "time"

// InventoryItem represents an inventory record joined with product catalog metadata
type InventoryItem struct {
	ID            int       `json:"id"`
	ProductID     int       `json:"productId"`
	SKU           string    `json:"sku"`
	Name          string    `json:"name"`
	Category      string    `json:"category"`
	CurrentStock  int       `json:"currentStock"`
	Quantity      int       `json:"quantity"`
	ReorderLevel  int       `json:"reorderLevel"`
	MinThreshold  int       `json:"minThreshold"`
	UpdatedAt     time.Time `json:"updatedAt"`
	LastRestocked time.Time `json:"lastRestocked"`
}

// AdjustStockRequest represents JSON payload to increment or decrement stock
type AdjustStockRequest struct {
	Amount int    `json:"amount"`
	Reason string `json:"reason,omitempty"`
}

// HealthResponse represents structured health probe response
type HealthResponse struct {
	Status    string    `json:"status"`
	Service   string    `json:"service"`
	Database  string    `json:"database"`
	Timestamp time.Time `json:"timestamp"`
	Version   string    `json:"version"`
}

// ErrorResponse represents standardized JSON error output
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
	Code    int    `json:"code"`
}
