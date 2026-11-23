import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

const CATEGORIES = [
  'Leather Goods',
  'Watches & Jewelry',
  'Apparel',
  'Home & Living',
  'Footwear',
  'Fragrance',
];

export const ProductModal = ({ isOpen, onClose, onSave, product = null }) => {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Leather Goods',
    price: '',
    costPrice: '',
    stock: '',
    minThreshold: '5',
    imageUrl: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || 'Leather Goods',
        price: product.price?.toString() || '',
        costPrice: product.costPrice?.toString() || '',
        stock: product.stock?.toString() || '',
        minThreshold: product.minThreshold?.toString() || '5',
        imageUrl: product.imageUrl || '',
        description: product.description || '',
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        sku: `SHP-${Math.random().toString(36).substring(2, 5).toUpperCase()}-0${Math.floor(Math.random() * 90 + 10)}`,
        category: 'Leather Goods',
        price: '',
        costPrice: '',
        stock: '10',
        minThreshold: '5',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
        description: '',
      });
      setErrors({});
    }
  }, [product, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU identifier is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid retail price required';
    if (formData.stock === '' || parseInt(formData.stock, 10) < 0) newErrors.stock = 'Valid stock quantity required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      price: parseFloat(formData.price),
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
      stock: parseInt(formData.stock, 10),
      minThreshold: parseInt(formData.minThreshold, 10) || 5,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Product' : 'Add New Catalog Product'}
      maxWidth="620px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Italian Wool Blazer"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">SKU (Stock Keeping Unit) *</label>
            <input
              type="text"
              className="form-input"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              style={{ fontFamily: 'var(--font-mono)' }}
            />
            {errors.sku && <div className="form-error">{errors.sku}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Retail Price (USD) *</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            {errors.price && <div className="form-error">{errors.price}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Cost Price (USD)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Initial Stock *</label>
            <input
              type="number"
              className="form-input"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
            {errors.stock && <div className="form-error">{errors.stock}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Low Stock Threshold</label>
            <input
              type="number"
              className="form-input"
              value={formData.minThreshold}
              onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Product Image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            {formData.imageUrl && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <small>Image preview</small>
              </div>
            )}
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Describe materials, origin, and features..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
