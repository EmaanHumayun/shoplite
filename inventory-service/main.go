package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	log.Println("=================================================================")
	log.Println(" ShopLite Inventory Microservice (Go 1.22)")
	log.Println(" Cloud Crafters Architecture")
	log.Println("=================================================================")

	cfg := LoadConfig()

	log.Printf("Connecting to PostgreSQL at %s:%s (Database: %s, User: %s)...",
		cfg.DBHost, cfg.DBPort, cfg.DBName, cfg.DBUser)

	var db *sql.DB
	var err error

	// Connect to database with retry loop
	for attempts := 1; attempts <= 5; attempts++ {
		db, err = InitDB(cfg.DSN())
		if err == nil {
			log.Println("Successfully connected to PostgreSQL database!")
			break
		}
		log.Printf("Database connection attempt %d/5 failed: %v. Retrying in 2 seconds...", attempts, err)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		log.Printf("WARNING: Starting service without active database connection. Handlers will report degraded status.")
	} else {
		defer db.Close()
	}

	mux := http.NewServeMux()

	// Register Health Check endpoints
	healthFn := HealthHandler(db)
	mux.HandleFunc("/health", healthFn)
	mux.HandleFunc("/api/health", healthFn)

	// Register Inventory Endpoints
	invFn := InventoryDispatcher(db)
	mux.HandleFunc("/inventory", invFn)
	mux.HandleFunc("/inventory/", invFn)
	mux.HandleFunc("/api/inventory", invFn)
	mux.HandleFunc("/api/inventory/", invFn)

	// Wrap router with CORS middleware
	handler := CORSMiddleware(mux)

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Server run context with graceful shutdown
	serverCtx, serverStopCtx := context.WithCancel(context.Background())

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)

	go func() {
		<-sig
		log.Println("Received termination signal. Initiating graceful shutdown...")

		shutdownCtx, shutdownCancel := context.WithTimeout(serverCtx, 10*time.Second)
		defer shutdownCancel()

		go func() {
			<-shutdownCtx.Done()
			if shutdownCtx.Err() == context.DeadlineExceeded {
				log.Fatal("Graceful shutdown timed out. Forcing exit.")
			}
		}()

		if err := server.Shutdown(shutdownCtx); err != nil {
			log.Fatalf("Server shutdown error: %v", err)
		}
		serverStopCtx()
	}()

	log.Printf("ShopLite Inventory Service listening on port %s (http://localhost:%s)", cfg.Port, cfg.Port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server crashed: %v", err)
	}

	<-serverCtx.Done()
	log.Println("ShopLite Inventory Service stopped cleanly.")
}
