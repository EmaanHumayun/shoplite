/**
 * ShopLite Centralized API Client & Service URLs
 * Configures endpoints for Node.js Catalog, Go Inventory, and Java Orders APIs
 */

export const API_CONFIG = {
  catalogUrl: import.meta.env.VITE_CATALOG_API_URL || 'http://localhost:4000/api',
  inventoryUrl: import.meta.env.VITE_INVENTORY_API_URL || 'http://localhost:5000/api',
  ordersUrl: import.meta.env.VITE_ORDERS_API_URL || 'http://localhost:8080/api',
  isMockMode: import.meta.env.VITE_USE_MOCK !== 'false', // Defaults to mock preview if backend is offline
};

/**
 * Generic Fetch Wrapper with Timeout & Error Handling
 */
export async function apiFetch(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
