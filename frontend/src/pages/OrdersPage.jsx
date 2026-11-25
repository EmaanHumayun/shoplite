import React, { useState, useMemo } from 'react';
import { Search, Eye, ShoppingCart } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';
import { AppLoader } from '../components/common/AppLoader';
import { formatCurrency, formatDate, getOrderBadge } from '../utils/formatters';

const STATUS_FILTERS = ['All', 'Processing', 'Completed', 'Pending', 'Cancelled'];

export const OrdersPage = () => {
  const { orders, updateOrderStatus, loading } = useApp();
  const outletContext = useOutletContext() || {};
  const globalSearch = outletContext.searchTerm || '';

  const [localSearch, setLocalSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingOrder, setViewingOrder] = useState(null);
  const pageSize = 6;

  const query = (localSearch || globalSearch).toLowerCase().trim();

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(query) ||
        o.customer.name.toLowerCase().includes(query) ||
        o.customer.email.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === 'All' || o.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, query, selectedStatus]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Order Fulfillment</h1>
          <p>Java Spring Boot Orders API transaction tracking and status lifecycle</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="search-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search order ID, customer name, email..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex gap-1">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`btn btn-sm ${selectedStatus === status ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    setSelectedStatus(status);
                    setCurrentPage(1);
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Total <strong>{filteredOrders.length}</strong> orders
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th style={{ textAlign: 'center' }}>Items</th>
              <th style={{ textAlign: 'right' }}>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  <AppLoader message="Streaming Transactions via Spring Boot Order Engine..." />
                </td>
              </tr>
            ) : paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No orders match your criteria.</p>
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const badge = getOrderBadge(order.status);
                const totalItemQty = order.items.reduce((acc, i) => acc + i.quantity, 0);

                return (
                  <tr key={order.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary-800)' }}>
                        {order.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.customer.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{order.customer.email}</div>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {formatDate(order.date)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <strong>{totalItemQty}</strong>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatCurrency(order.total)}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {order.paymentMethod}
                    </td>
                    <td>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => setViewingOrder(order)}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={Boolean(viewingOrder)}
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onUpdateStatus={async (id, newStatus) => {
          await updateOrderStatus(id, newStatus);
          setViewingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }}
      />
    </div>
  );
};
