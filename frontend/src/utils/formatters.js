/**
 * ShopLite Formatting Utilities
 */

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatNumber = (num) => {
  if (typeof num !== 'number') {
    num = parseInt(num, 10) || 0;
  }
  return new Intl.NumberFormat('en-US').format(num);
};

export const getStockBadge = (quantity, threshold = 10) => {
  const qty = parseInt(quantity, 10) || 0;
  if (qty <= 0) {
    return { label: 'Out of Stock', variant: 'danger' };
  }
  if (qty <= threshold) {
    return { label: 'Low Stock', variant: 'warning' };
  }
  return { label: 'In Stock', variant: 'success' };
};

export const getOrderBadge = (status) => {
  const normalized = (status || '').toLowerCase();
  switch (normalized) {
    case 'completed':
    case 'delivered':
      return { label: 'Completed', variant: 'success' };
    case 'processing':
      return { label: 'Processing', variant: 'info' };
    case 'pending':
      return { label: 'Pending', variant: 'warning' };
    case 'cancelled':
      return { label: 'Cancelled', variant: 'danger' };
    default:
      return { label: status || 'Unknown', variant: 'info' };
  }
};
