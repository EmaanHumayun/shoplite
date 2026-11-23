import { API_CONFIG, apiFetch } from './api';
import { INITIAL_ORDERS } from './mockData';

let localOrders = [...INITIAL_ORDERS];

export const orderService = {
  async getOrders() {
    if (!API_CONFIG.isMockMode) {
      try {
        return await apiFetch(`${API_CONFIG.ordersUrl}/orders`);
      } catch (err) {
        console.warn('[Orders API] Backend unreachable, falling back to mock data:', err.message);
      }
    }
    await new Promise(r => setTimeout(r, 120));
    return [...localOrders];
  },

  async getOrderById(id) {
    if (!API_CONFIG.isMockMode) {
      try {
        return await apiFetch(`${API_CONFIG.ordersUrl}/orders/${id}`);
      } catch (err) {
        console.warn('[Orders API] Falling back to mock order:', err.message);
      }
    }
    return localOrders.find(o => o.id === id) || null;
  },

  async updateOrderStatus(id, newStatus) {
    if (!API_CONFIG.isMockMode) {
      try {
        return await apiFetch(`${API_CONFIG.ordersUrl}/orders/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: newStatus })
        });
      } catch (err) {
        console.warn('[Orders API] Falling back to mock status update:', err.message);
      }
    }
    localOrders = localOrders.map(o => (o.id === id ? { ...o, status: newStatus } : o));
    return localOrders.find(o => o.id === id);
  }
};
