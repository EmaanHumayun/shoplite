import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, AlertTriangle, Layers } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StockAdjustModal } from '../components/inventory/StockAdjustModal';
import { formatDate, getStockBadge } from '../utils/formatters';

export const InventoryPage = () => {
  const { inventory, adjustStock, loading } = useApp();
  const outletContext = useOutletContext() || {};
  const globalSearch = outletContext.searchTerm || '';

  const [localSearch, setLocalSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  const query = (localSearch || globalSearch).toLowerCase().trim();

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchesStatus =
        filterStatus === 'All' ||
        (filterStatus === 'Low Stock' && item.currentStock > 0 && item.currentStock <= item.minThreshold) ||
        (filterStatus === 'Out of Stock' && item.currentStock <= 0) ||
        (filterStatus === 'Adequate' && item.currentStock > item.minThreshold);

      return matchesSearch && matchesStatus;
    });
  }, [inventory, query, filterStatus]);

  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minThreshold).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Go Inventory API real-time stock levels and threshold monitoring</p>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
            backgroundColor: 'var(--status-warning-bg)',
            border: '1px solid var(--status-warning-border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} color="var(--status-warning-text)" />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--status-warning-text)' }}>
                {lowStockCount} items currently below minimum stock threshold
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--status-warning-text)' }}>
                Stock restocks should be triggered through the Go Inventory Service to maintain order fulfillment.
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFilterStatus(filterStatus === 'Low Stock' ? 'All' : 'Low Stock')}
          >
            {filterStatus === 'Low Stock' ? 'Show All' : 'Filter Low Stock'}
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="search-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search SKU or product..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>

            <select
              className="form-select"
              style={{ width: 'auto', minWidth: 160 }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Inventory</option>
              <option value="Adequate">Adequate Stock</option>
              <option value="Low Stock">Low Stock Alert</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredInventory.length}</strong> items
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th style={{ textAlign: 'center' }}>Current Stock</th>
              <th style={{ textAlign: 'center' }}>Min Threshold</th>
              <th>Stock Status</th>
              <th>Last Restocked</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No inventory records match your criteria.</p>
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => {
                const badge = getStockBadge(item.currentStock, item.minThreshold);
                return (
                  <tr key={item.sku}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary-800)' }}>
                        {item.sku}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                    </td>
                    <td>{item.category}</td>
                    <td style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 700 }}>
                      <span style={{ color: item.currentStock <= item.minThreshold ? 'var(--status-danger-text)' : 'inherit' }}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      {item.minThreshold}
                    </td>
                    <td>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {formatDate(item.lastRestocked)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={SlidersHorizontal}
                        onClick={() => setSelectedItem(item)}
                      >
                        Adjust Stock
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustModal
        isOpen={Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAdjust={adjustStock}
      />
    </div>
  );
};
