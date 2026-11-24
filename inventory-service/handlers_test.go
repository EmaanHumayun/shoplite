package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

// TestHealthHandler verifies that GET /health returns valid JSON and healthy/degraded status
func TestHealthHandler(t *testing.T) {
	req, err := http.NewRequest("GET", "/health", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	rr := httptest.NewRecorder()
	handler := HealthHandler(nil) // test with nil DB to check safe fallback
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("HealthHandler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var resp HealthResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to parse JSON response: %v", err)
	}

	if resp.Service != "shoplite-inventory-service" {
		t.Errorf("Expected service name 'shoplite-inventory-service', got '%s'", resp.Service)
	}

	if resp.Database != "disconnected" {
		t.Errorf("Expected database 'disconnected' when DB is nil, got '%s'", resp.Database)
	}
}

// TestCORSMiddleware verifies proper CORS headers on responses and preflight OPTIONS
func TestCORSMiddleware(t *testing.T) {
	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	corsHandler := CORSMiddleware(nextHandler)

	// Test GET request headers
	req, _ := http.NewRequest("GET", "/inventory", nil)
	rr := httptest.NewRecorder()
	corsHandler.ServeHTTP(rr, req)

	if origin := rr.Header().Get("Access-Control-Allow-Origin"); origin != "*" {
		t.Errorf("Expected Access-Control-Allow-Origin '*', got '%s'", origin)
	}

	// Test OPTIONS preflight request
	reqOptions, _ := http.NewRequest("OPTIONS", "/inventory", nil)
	rrOptions := httptest.NewRecorder()
	corsHandler.ServeHTTP(rrOptions, reqOptions)

	if status := rrOptions.Code; status != http.StatusOK {
		t.Errorf("Expected OPTIONS to return 200 OK, got %v", status)
	}
}

// TestAdjustStockInvalidJSON verifies that invalid body returns 400 Bad Request
func TestAdjustStockInvalidJSON(t *testing.T) {
	body := bytes.NewBufferString("{ invalid_json: true }")
	req, _ := http.NewRequest("POST", "/inventory/SHP-LTH-01/adjust", body)
	rr := httptest.NewRecorder()

	dispatcher := InventoryDispatcher(nil)
	dispatcher.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("Expected 400 Bad Request for malformed JSON, got %v", status)
	}

	var errResp ErrorResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &errResp); err != nil {
		t.Fatalf("Failed to parse error response: %v", err)
	}

	if errResp.Error != "Bad Request" {
		t.Errorf("Expected Error 'Bad Request', got '%s'", errResp.Error)
	}
}

// TestMethodNotAllowed verifies that invalid HTTP methods return 405 Method Not Allowed
func TestMethodNotAllowed(t *testing.T) {
	req, _ := http.NewRequest("DELETE", "/inventory", nil)
	rr := httptest.NewRecorder()

	dispatcher := InventoryDispatcher(nil)
	dispatcher.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusMethodNotAllowed {
		t.Errorf("Expected 405 Method Not Allowed for DELETE /inventory, got %v", status)
	}
}

// TestLoadConfigDefaults verifies fallback values for environment variables
func TestLoadConfigDefaults(t *testing.T) {
	os.Unsetenv("PORT")
	os.Unsetenv("DB_HOST")
	os.Unsetenv("DB_PORT")

	cfg := LoadConfig()

	if cfg.Port != "5000" {
		t.Errorf("Expected default Port '5000', got '%s'", cfg.Port)
	}
	if cfg.DBHost != "localhost" {
		t.Errorf("Expected default DBHost 'localhost', got '%s'", cfg.DBHost)
	}
	if cfg.DBPort != "5432" {
		t.Errorf("Expected default DBPort '5432', got '%s'", cfg.DBPort)
	}
}
