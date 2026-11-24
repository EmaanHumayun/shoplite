package main

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
)

// InitDB sets up PostgreSQL connection pool with production parameters
func InitDB(dsn string) (*sql.DB, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// Configure pool parameters
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(15 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("database unreachable: %w", err)
	}

	return db, nil
}

// PingDB verifies database liveliness
func PingDB(ctx context.Context, db *sql.DB) error {
	if db == nil {
		return fmt.Errorf("database connection is nil")
	}
	return db.PingContext(ctx)
}

// GetAllInventory retrieves all inventory records joined with product catalog metadata
func GetAllInventory(ctx context.Context, db *sql.DB) ([]InventoryItem, error) {
	query := `
		SELECT 
			i.id,
			i.product_id,
			p.sku,
			p.name,
			p.category,
			i.quantity,
			i.reorder_level,
			i.updated_at
		FROM inventory i
		JOIN products p ON i.product_id = p.id
		ORDER BY p.name ASC
	`

	rows, err := db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("querying inventory: %w", err)
	}
	defer rows.Close()

	var items []InventoryItem
	for rows.Next() {
		var item InventoryItem
		if err := rows.Scan(
			&item.ID,
			&item.ProductID,
			&item.SKU,
			&item.Name,
			&item.Category,
			&item.Quantity,
			&item.ReorderLevel,
			&item.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scanning inventory row: %w", err)
		}
		item.CurrentStock = item.Quantity
		item.MinThreshold = item.ReorderLevel
		item.LastRestocked = item.UpdatedAt
		items = append(items, item)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterating inventory rows: %w", err)
	}

	if items == nil {
		items = []InventoryItem{}
	}

	return items, nil
}

// GetInventoryBySKU retrieves inventory details for a specific product SKU
func GetInventoryBySKU(ctx context.Context, db *sql.DB, sku string) (*InventoryItem, error) {
	query := `
		SELECT 
			i.id,
			i.product_id,
			p.sku,
			p.name,
			p.category,
			i.quantity,
			i.reorder_level,
			i.updated_at
		FROM inventory i
		JOIN products p ON i.product_id = p.id
		WHERE p.sku = $1
		LIMIT 1
	`

	var item InventoryItem
	err := db.QueryRowContext(ctx, query, sku).Scan(
		&item.ID,
		&item.ProductID,
		&item.SKU,
		&item.Name,
		&item.Category,
		&item.Quantity,
		&item.ReorderLevel,
		&item.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("querying inventory by sku: %w", err)
	}

	item.CurrentStock = item.Quantity
	item.MinThreshold = item.ReorderLevel
	item.LastRestocked = item.UpdatedAt

	return &item, nil
}

// AdjustStockBySKU modifies quantity atomically using PostgreSQL transaction and GREATEST
func AdjustStockBySKU(ctx context.Context, db *sql.DB, sku string, amount int) (*InventoryItem, error) {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("beginning transaction: %w", err)
	}
	defer tx.Rollback()

	// Update stock with non-negative constraint
	updateQuery := `
		UPDATE inventory i
		SET 
			quantity = GREATEST(0, i.quantity + $1),
			updated_at = CURRENT_TIMESTAMP
		FROM products p
		WHERE i.product_id = p.id AND p.sku = $2
		RETURNING 
			i.id,
			i.product_id,
			p.sku,
			p.name,
			p.category,
			i.quantity,
			i.reorder_level,
			i.updated_at
	`

	var item InventoryItem
	err = tx.QueryRowContext(ctx, updateQuery, amount, sku).Scan(
		&item.ID,
		&item.ProductID,
		&item.SKU,
		&item.Name,
		&item.Category,
		&item.Quantity,
		&item.ReorderLevel,
		&item.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil // Product / inventory not found
	}
	if err != nil {
		return nil, fmt.Errorf("updating stock: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return nil, fmt.Errorf("committing transaction: %w", err)
	}

	item.CurrentStock = item.Quantity
	item.MinThreshold = item.ReorderLevel
	item.LastRestocked = item.UpdatedAt

	return &item, nil
}
