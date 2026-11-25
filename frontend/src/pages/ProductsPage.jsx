import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { ProductModal } from '../components/products/ProductModal';
import { DeleteConfirmModal } from '../components/products/DeleteConfirmModal';
import { AppLoader } from '../components/common/AppLoader';
import { formatCurrency, getStockBadge } from '../utils/formatters';

const CATEGORIES = [
  'All Categories',
  'Leather Goods',
  'Watches & Jewelry',
  'Apparel',
  'Home & Living',
  'Footwear',
  'Fragrance',
];

export const ProductsPage = () => {
  const { products, createProduct, updateProduct, deleteProduct, loading } = useApp();
  const outletContext = useOutletContext() || {};
  const globalSearch = outletContext.searchTerm || '';

  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStockFilter, setSelectedStockFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const query = (localSearch || globalSearch).toLowerCase().trim();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All Categories' || p.category === selectedCategory;

      const matchesStock =
        selectedStockFilter === 'All' ||
        (selectedStockFilter === 'In Stock' && p.stock > p.minThreshold) ||
        (selectedStockFilter === 'Low Stock' && p.stock > 0 && p.stock <= p.minThreshold) ||
        (selectedStockFilter === 'Out of Stock' && p.stock <= 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, query, selectedCategory, selectedStockFilter]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
    } else {
      await createProduct(productData);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Product Catalog</h1>
          <p>Node.js &amp; Express Catalog API product management</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Add Product
        </Button>
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
                placeholder="Search name, SKU, tag..."
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              className="form-select"
              style={{ width: 'auto', minWidth: 160 }}
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: 'auto', minWidth: 140 }}
              value={selectedStockFilter}
              onChange={(e) => {
                setSelectedStockFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Stock</option>
              <option value="In Stock">In Stock (&gt; threshold)</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Total <strong>{filteredProducts.length}</strong> products found
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th style={{ textAlign: 'right' }}>Price</th>
              <th style={{ textAlign: 'center' }}>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <AppLoader message="Synchronizing Product Catalog via Node.js Gateway..." />
                </td>
              </tr>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No products match your current search and filters.</p>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p) => {
                const stockBadge = getStockBadge(p.stock, p.minThreshold);
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 'var(--radius-sm)',
                            objectFit: 'cover',
                            border: '1px solid var(--border-subtle)',
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--primary-800)', fontWeight: 600 }}>
                        {p.sku}
                      </span>
                    </td>
                    <td>{p.category}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatCurrency(p.price)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <strong>{p.stock}</strong>
                    </td>
                    <td>
                      <Badge variant={stockBadge.variant}>{stockBadge.label}</Badge>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="inline-flex gap-1">
                        <Button
                          variant="icon"
                          onClick={() => handleOpenEdit(p)}
                          title="Edit product"
                        >
                          <Edit2 size={15} />
                        </Button>
                        <Button
                          variant="icon"
                          onClick={() => setDeletingProduct(p)}
                          title="Delete product"
                        >
                          <Trash2 size={15} color="var(--status-danger-text)" />
                        </Button>
                      </div>
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
          totalItems={filteredProducts.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        itemName={deletingProduct ? `"${deletingProduct.name}"` : ''}
        onConfirm={async () => {
          if (deletingProduct) {
            await deleteProduct(deletingProduct.id);
            setDeletingProduct(null);
          }
        }}
      />
    </div>
  );
};
