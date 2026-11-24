package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
)

// writeJSON writes a JSON response with proper Content-Type header
func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("Error writing JSON response: %v", err)
	}
}

// writeError writes a standardized JSON error message
func writeError(w http.ResponseWriter, status int, errTitle string, message string) {
	writeJSON(w, status, ErrorResponse{
		Error:   errTitle,
		Message: message,
		Code:    status,
	})
}

// CORSMiddleware enables cross-origin resource sharing for frontend clients
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// HealthHandler returns health status of the service and database ping
func HealthHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dbStatus := "connected"
		ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
		defer cancel()

		if err := PingDB(ctx, db); err != nil {
			dbStatus = "disconnected"
			log.Printf("Health check DB ping failed: %v", err)
		}

		status := "healthy"
		httpStatus := http.StatusOK
		if dbStatus != "connected" {
			status = "degraded"
			// In degraded mode we still return 200 with degraded state or 503 depending on requirements
		}

		writeJSON(w, httpStatus, HealthResponse{
			Status:    status,
			Service:   "shoplite-inventory-service",
			Database:  dbStatus,
			Timestamp: time.Now().UTC(),
			Version:   "1.0.0",
		})
	}
}

// GetInventoryHandler returns full inventory list joined with product details
func GetInventoryHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
		defer cancel()

		items, err := GetAllInventory(ctx, db)
		if err != nil {
			log.Printf("Error fetching inventory: %v", err)
			writeError(w, http.StatusInternalServerError, "Internal Server Error", "Failed to retrieve inventory records")
			return
		}

		writeJSON(w, http.StatusOK, items)
	}
}

// InventoryDispatcher handles /inventory and /inventory/{sku} and /inventory/{sku}/adjust
func InventoryDispatcher(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Strip prefix /api/inventory or /inventory
		path := r.URL.Path
		path = strings.TrimPrefix(path, "/api")
		path = strings.TrimPrefix(path, "/inventory")
		path = strings.TrimPrefix(path, "/")

		// Case 1: GET /inventory
		if path == "" {
			if r.Method == http.MethodGet {
				GetInventoryHandler(db)(w, r)
				return
			}
			writeError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Only GET is allowed on /inventory")
			return
		}

		// Parts: ["SKU"] or ["SKU", "adjust"]
		parts := strings.Split(path, "/")
		sku := parts[0]

		if len(parts) == 1 {
			// GET /inventory/{sku}
			if r.Method == http.MethodGet {
				ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
				defer cancel()

				item, err := GetInventoryBySKU(ctx, db, sku)
				if err != nil {
					log.Printf("Error fetching inventory by SKU %s: %v", sku, err)
					writeError(w, http.StatusInternalServerError, "Internal Server Error", "Database query failure")
					return
				}
				if item == nil {
					writeError(w, http.StatusNotFound, "Not Found", "No inventory item found for SKU: "+sku)
					return
				}

				writeJSON(w, http.StatusOK, item)
				return
			}
			writeError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Method not supported on /inventory/{sku}")
			return
		}

		if len(parts) == 2 && parts[1] == "adjust" {
			// POST /inventory/{sku}/adjust
			if r.Method != http.MethodPost {
				writeError(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Only POST is allowed on /inventory/{sku}/adjust")
				return
			}

			var req AdjustStockRequest
			if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
				writeError(w, http.StatusBadRequest, "Bad Request", "Invalid JSON payload: "+err.Error())
				return
			}

			ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
			defer cancel()

			updatedItem, err := AdjustStockBySKU(ctx, db, sku, req.Amount)
			if err != nil {
				log.Printf("Error adjusting stock for SKU %s: %v", sku, err)
				writeError(w, http.StatusInternalServerError, "Internal Server Error", "Failed to update inventory stock")
				return
			}
			if updatedItem == nil {
				writeError(w, http.StatusNotFound, "Not Found", "Cannot adjust stock. SKU does not exist: "+sku)
				return
			}

			log.Printf("Stock adjusted for SKU: %s, amount: %d, new quantity: %d", sku, req.Amount, updatedItem.Quantity)
			writeJSON(w, http.StatusOK, updatedItem)
			return
		}

		writeError(w, http.StatusNotFound, "Not Found", "Endpoint not found: "+r.URL.Path)
	}
}
