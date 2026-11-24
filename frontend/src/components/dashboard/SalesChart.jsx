import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export const SalesChart = ({ data = [] }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1000);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Weekly Revenue Trends</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Daily gross sales performance across all channels
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-800)' }}>
            {formatCurrency(data.reduce((acc, curr) => acc + curr.revenue, 0))}
          </span>
          <div style={{ fontSize: '0.72rem', color: 'var(--status-success-text)', fontWeight: 600 }}>
            +14.8% vs last week
          </div>
        </div>
      </div>

      <div style={{ height: 210, display: 'flex', alignItems: 'flex-end', gap: '1.25rem', padding: '1rem 0.5rem 0' }}>
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>
                ${(item.revenue / 1000).toFixed(1)}k
              </div>
              <div
                style={{
                  width: '100%',
                  maxWidth: 38,
                  height: `${heightPercent}%`,
                  backgroundColor: idx === data.length - 2 ? 'var(--primary-700)' : 'var(--gold-400)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 400ms ease, background-color 200ms',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                }}
                title={`${item.day}: ${formatCurrency(item.revenue)} (${item.orders} orders)`}
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 8, fontWeight: 600 }}>
                {item.day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
