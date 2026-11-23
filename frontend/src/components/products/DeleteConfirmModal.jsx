import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName = 'this item' }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      maxWidth="460px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete Permanently
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--status-danger-bg)',
          color: 'var(--status-danger-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertCircle size={22} />
        </div>
        <div>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
            Are you sure you want to delete {itemName}?
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6 }}>
            This action will immediately remove the item from the Catalog API and purge linked Inventory records. This action cannot be undone.
          </p>
        </div>
      </div>
    </Modal>
  );
};
