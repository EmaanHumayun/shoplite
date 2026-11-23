import React from 'react';
import { Package, ShoppingBag, DollarSign, AlertCircle, Plus, Shield, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueOrdersChart } from '../components/charts/RevenueOrdersChart';
import { RecentOrders } from '../components/dashboard/RecentOrders';
import { InventorySummary } from '../components/dashboard/InventorySummary';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatCurrency, formatNumber } from '../utils/formatters';

export const DashboardPage = () => {
  const { products, orders, salesData, stats, loading } = useApp();
  const { isSuperAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading ShopLite Analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>Executive Commerce Overview</h1>
            <Badge variant="healthy" className="flex items-center gap-1">
              <span className="status-pip status-pip-healthy" />
              OPERATIONAL
            </Badge>
          </div>
          <p>Multi-service e-commerce product management and transaction fulfillment</p>
        </div>
        <div className="flex gap-2">
          {isSuperAdmin && (
            <Link to="/devops/overview">
              <Button variant="secondary" icon={Activity}>
                DevOps Command Center
              </Button>
            </Link>
          )}
          <Link to="/products">
            <Button variant="primary" icon={Plus}>
              New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          title="Total Products"
          value={formatNumber(stats.totalProducts)}
          meta="Catalog API active"
          metaType="positive"
          icon={Package}
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(stats.totalOrders)}
          meta="Spring Boot orders"
          metaType="positive"
          icon={ShoppingBag}
        />
        <StatCard
          title="Total Gross Revenue"
          value={formatCurrency(stats.totalRevenue)}
          meta="Settled transactions"
          metaType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockCount}
          meta={stats.lowStockCount > 0 ? "Replenishment required" : "Healthy levels"}
          metaType={stats.lowStockCount > 0 ? "negative" : "positive"}
          icon={AlertCircle}
        />
      </div>

      {/* Sales Analytics Chart & Inventory Summary */}
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '1.5rem' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <RevenueOrdersChart data={salesData} />
        </div>
        <div>
          <InventorySummary products={products} />
        </div>
      </div>

      {/* Recent Orders List */}
      <RecentOrders orders={orders} />
    </div>
  );
};
