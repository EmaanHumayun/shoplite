import { API_CONFIG, apiFetch } from './api';
import { INITIAL_PRODUCTS } from './mockData';

// Maintain inventory synchronicity with products
let localInventory = INITIAL_PRODUCTS.map(p => ({
  sku: p.sku,
  productId: p.id,
  name: p.name,
  category: p.category,
  currentStock: p.stock,
  minThreshold: p.minThreshold,
  lastRestocked: p.createdAt
}));

export const inventoryService = {
  async getInventory() {
    if (!API_CONFIG.isMockMode) {
      try {
        return await apiFetch(`${API_CONFIG.inventoryUrl}/inventory`);
      } catch (err) {
        console.warn('[Inventory API] Backend unreachable, falling back to mock data:', err.message);
      }
    }
    await new Promise(r => setTimeout(r, 120));
    return [...localInventory];
  },

  async adjustStock(sku, adjustmentAmount, reason = 'manual_recount') {
    if (!API_CONFIG.isMockMode) {
      try {
        return await apiFetch(`${API_CONFIG.inventoryUrl}/inventory/${sku}/adjust`, {
          method: 'POST',
          body: JSON.stringify({ amount: adjustmentAmount, reason })
        });
      } catch (err) {
        console.warn('[Inventory API] Falling back to mock adjustment:', err.message);
      }
    }

    localInventory = localInventory.map(item => {
      if (item.sku === sku) {
        const updated = Math.max(0, item.currentStock + adjustmentAmount);
        return {
          ...item,
          currentStock: updated,
          lastRestocked: adjustmentAmount > 0 ? new Date().toISOString() : item.lastRestocked
        };
      }
      return item;
    });

    return localInventory.find(i => i.sku === sku);
  }
};
