import React, { createContext, useContext, useState, useEffect } from 'react';
import { catalogService } from '../services/catalogService';
import { inventoryService } from '../services/inventoryService';
import { orderService } from '../services/orderService';
import { SALES_CHART_DATA } from '../services/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesData] = useState(SALES_CHART_DATA);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prods, inv, ords] = await Promise.all([
        catalogService.getProducts(),
        inventoryService.getInventory(),
        orderService.getOrders(),
      ]);
      setProducts(prods);
      setInventory(inv);
      setOrders(ords);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      showNotification('Failed to load platform data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Product Actions
  const handleCreateProduct = async (productData) => {
    const created = await catalogService.createProduct(productData);
    setProducts(prev => [created, ...prev]);
    // Also create inventory entry
    setInventory(prev => [{
      sku: created.sku,
      productId: created.id,
      name: created.name,
      category: created.category,
      currentStock: created.stock,
      minThreshold: created.minThreshold || 5,
      lastRestocked: new Date().toISOString()
    }, ...prev]);
    showNotification(`Product "${created.name}" created successfully!`);
    return created;
  };

  const handleUpdateProduct = async (id, productData) => {
    const updated = await catalogService.updateProduct(id, productData);
    setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    setInventory(prev => prev.map(i => (i.productId === id ? {
      ...i,
      name: updated.name,
      category: updated.category,
      currentStock: updated.stock
    } : i)));
    showNotification(`Product "${updated.name}" updated!`);
    return updated;
  };

  const handleDeleteProduct = async (id) => {
    await catalogService.deleteProduct(id);
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    setInventory(prev => prev.filter(i => i.productId !== id));
    showNotification(`Product "${prod ? prod.name : id}" deleted.`);
  };

  // Inventory Actions
  const handleAdjustStock = async (sku, delta, reason) => {
    const adjusted = await inventoryService.adjustStock(sku, delta, reason);
    setInventory(prev => prev.map(i => (i.sku === sku ? adjusted : i)));
    setProducts(prev => prev.map(p => (p.sku === sku ? { ...p, stock: adjusted.currentStock } : p)));
    showNotification(`Stock adjusted for SKU ${sku} (${delta > 0 ? `+${delta}` : delta})`);
    return adjusted;
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const updated = await orderService.updateOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
    showNotification(`Order ${orderId} marked as ${newStatus}`);
    return updated;
  };

  // Derived Stats
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStockCount = products.filter(p => p.stock <= p.minThreshold).length;

  return (
    <AppContext.Provider
      value={{
        products,
        inventory,
        orders,
        salesData,
        loading,
        notification,
        showNotification,
        refreshData: loadAllData,
        createProduct: handleCreateProduct,
        updateProduct: handleUpdateProduct,
        deleteProduct: handleDeleteProduct,
        adjustStock: handleAdjustStock,
        updateOrderStatus: handleUpdateOrderStatus,
        stats: {
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
          lowStockCount,
        }
      }}
    >
      {children}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: notification.type === 'error' ? 'var(--status-danger-text)' : 'var(--primary-800)',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 200,
          fontSize: '0.88rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideUp 180ms ease'
        }}>
          <span>{notification.message}</span>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
