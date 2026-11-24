import { API_CONFIG, apiFetch } from './api';
import { INITIAL_PRODUCTS } from './mockData';

// In-Memory mock store for development interactivity
let localProducts = [...INITIAL_PRODUCTS];

export const catalogService = {
  async getProducts() {
    if (!API_CONFIG.isMockMode) {
      try {
        return await apiFetch(`${API_CONFIG.catalogUrl}/products`);
      } catch (err) {
        console.warn('[Catalog API] Backend unreachable, falling back to mock data:', err.message);
      }
    }
    // Simulated network latency
    await new Promise(r => setTimeout(r, 120));
    return [...localProducts];
  },

  async getProductById(id) {
    if (!API_CONFIG.isMockMode) {
      try {
        return await apiFetch(`${API_CONFIG.catalogUrl}/products/${id}`);
      } catch (err) {
        console.warn('[Catalog API] Falling back to mock data:', err.message);
      }
    }
    return localProducts.find(p => p.id === id) || null;
  },

  async createProduct(productData) {
    if (!API_CONFIG.isMockMode) {
      try {
        return await apiFetch(`${API_CONFIG.catalogUrl}/products`, {
          method: 'POST',
          body: JSON.stringify(productData)
        });
      } catch (err) {
        console.warn('[Catalog API] Falling back to mock create:', err.message);
      }
    }
    const newProduct = {
      ...productData,
      id: `prod-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString()
    };
    localProducts = [newProduct, ...localProducts];
    return newProduct;
  },

  async updateProduct(id, productData) {
    if (!API_CONFIG.isMockMode) {
      try {
        return await apiFetch(`${API_CONFIG.catalogUrl}/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(productData)
        });
      } catch (err) {
        console.warn('[Catalog API] Falling back to mock update:', err.message);
      }
    }
    localProducts = localProducts.map(p => (p.id === id ? { ...p, ...productData } : p));
    return localProducts.find(p => p.id === id);
  },

  async deleteProduct(id) {
    if (!API_CONFIG.isMockMode) {
      try {
        return await apiFetch(`${API_CONFIG.catalogUrl}/products/${id}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.warn('[Catalog API] Falling back to mock delete:', err.message);
      }
    }
    localProducts = localProducts.filter(p => p.id !== id);
    return { success: true, id };
  }
};
