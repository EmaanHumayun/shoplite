import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const StockAdjustModal = ({ isOpen, onClose, item, onAdjust }) => {
  const [delta, setDelta] = useState('');
  const [type, setType] = useState('add');
  const [reason, setReason] = useState('restock');

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(delta, 10);
    if (isNaN(amount) || amount <= 0) return;

    const finalDelta = type === 'add' ? amount : -amount;
    onAdjust(item.sku, finalDelta, reason);
    onClose();
    setDelta('');
  };

  const currentStock = item.currentStock ?? item.stock ?? 0;
  const numericDelta = parseInt(delta, 10) || 0;
  const previewStock = type === 'add' ? currentStock + numericDelta : Math.max(0, currentStock - numericDelta);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Adjust Stock — ${item.sku}`}
      maxWidth="480px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!delta || numericDelta <= 0}>
            Apply Adjustment
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Current Stock: <strong>{currentStock} units</strong></span>
            <span>New Projected: <strong style={{ color: 'var(--primary-700)' }}>{previewStock} units</strong></span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Adjustment Type</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              type="button"
              variant={type === 'add' ? 'primary' : 'secondary'}
              className="flex-1"
              onClick={() => setType('add')}
            >
              + Add Stock (Restock)
            </Button>
            <Button
              type="button"
              variant={type === 'remove' ? 'danger' : 'secondary'}
              className="flex-1"
              onClick={() => setType('remove')}
            >
              - Remove Stock (Audit/Damage)
            </Button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Units to {type === 'add' ? 'Add' : 'Remove'} *</label>
          <input
            type="number"
            min="1"
            className="form-input"
            placeholder="e.g. 25"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Audit Reason</label>
          <select
            className="form-select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="restock">Shipment Restock</option>
            <option value="audit">Physical Inventory Recount</option>
            <option value="damaged">Damaged / Expired Goods</option>
            <option value="return">Customer Return Restock</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};
