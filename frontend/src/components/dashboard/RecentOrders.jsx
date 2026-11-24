import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDate, getOrderBadge } from '../../utils/formatters';

export const RecentOrders = ({ orders = [] }) => {
  const displayOrders = orders.slice(0, 5);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Recent Customer Orders</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time orders processed through ShopLite Orders API
          </p>
        </div>
        <Link to="/orders" className="flex items-center gap-1" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
          View All Orders <ArrowRight size={14} />
        </Link>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map((order) => {
              const badge = getOrderBadge(order.status);
              return (
                <tr key={order.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--primary-800)', fontFamily: 'var(--font-mono)' }}>
                      {order.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.customer.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{order.customer.city}</div>
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{formatDate(order.date)}</td>
                  <td>
                    <strong>{formatCurrency(order.total)}</strong>
                  </td>
                  <td>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
