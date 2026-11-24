import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { getStockBadge } from '../../utils/formatters';

export const InventorySummary = ({ products = [] }) => {
  const lowStockProducts = products.filter(p => p.stock <= p.minThreshold);
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Inventory Health Overview</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Go Inventory API Stock Monitoring
          </p>
        </div>
        <Link to="/inventory" className="flex items-center gap-1" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
          Manage Stock <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ flex: 1, padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Units in Stock
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
            {totalStock}
          </div>
        </div>

        <div style={{ flex: 1, padding: '0.85rem', backgroundColor: lowStockProducts.length > 0 ? 'var(--status-warning-bg)' : 'var(--status-success-bg)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.74rem', color: lowStockProducts.length > 0 ? 'var(--status-warning-text)' : 'var(--status-success-text)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            {lowStockProducts.length > 0 ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
            Action Required
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: lowStockProducts.length > 0 ? 'var(--status-warning-text)' : 'var(--status-success-text)', marginTop: 2 }}>
            {lowStockProducts.length} Items Low
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {lowStockProducts.slice(0, 4).map(item => {
          const badge = getStockBadge(item.stock, item.minThreshold);
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-body)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.sku}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Badge variant={badge.variant}>{item.stock} left</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
