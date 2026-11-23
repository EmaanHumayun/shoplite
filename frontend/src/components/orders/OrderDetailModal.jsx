import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDate, getOrderBadge } from '../../utils/formatters';

export const OrderDetailModal = ({ isOpen, onClose, order, onUpdateStatus }) => {
  if (!order) return null;

  const badge = getOrderBadge(order.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details — ${order.id}`}
      maxWidth="600px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Order Date</div>
          <div style={{ fontWeight: 600 }}>{formatDate(order.date)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Payment: {order.paymentMethod}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>Order Status</div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary-900)' }}>Customer &amp; Shipping</h4>
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
          <div><strong>{order.customer.name}</strong></div>
          <div style={{ color: 'var(--text-muted)' }}>{order.customer.email} • {order.customer.phone}</div>
          <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{order.customer.city}</div>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary-900)' }}>Ordered Items</h4>
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <table className="data-table" style={{ fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th>Item</th>
                <th>SKU</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Price</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{item.sku}</td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tax (8%):</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)', marginTop: 4, borderTop: '1px solid var(--border-subtle)', paddingTop: 4 }}>
            <span>Total:</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
