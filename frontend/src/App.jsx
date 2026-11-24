import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, ROLES } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { RequireRole } from './components/auth/RequireRole';

// Commerce Pages
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { InventoryPage } from './pages/InventoryPage';
import { OrdersPage } from './pages/OrdersPage';
import { CustomersPage } from './pages/CustomersPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Super Admin DevOps Observability Pages
import { SystemOverviewPage } from './pages/devops/SystemOverviewPage';
import { TrafficAnalyticsPage } from './pages/devops/TrafficAnalyticsPage';
import { PerformancePage } from './pages/devops/PerformancePage';
import { HealthPage } from './pages/devops/HealthPage';
import { InfrastructurePage } from './pages/devops/InfrastructurePage';
import { DatabasePage } from './pages/devops/DatabasePage';
import { ContainersPage } from './pages/devops/ContainersPage';
import { DeploymentsPage } from './pages/devops/DeploymentsPage';
import { SecurityPage } from './pages/devops/SecurityPage';
import { AlertsPage } from './pages/devops/AlertsPage';
import { AccessManagementPage } from './pages/devops/AccessManagementPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Commerce Operations Routes (Admin & Super Admin) */}
                <Route index element={<DashboardPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />

                {/* Super Admin DevOps Observability Routes (Role Protected) */}
                <Route
                  path="devops/overview"
                  element={
                    <RequireRole allowedRole={ROLES.SUPER_ADMIN}>
                      <SystemOverviewPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="devops/traffic"
                  element={
                    <RequireRole allowedRole={ROLES.SUPER_ADMIN}>
                      <TrafficAnalyticsPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="devops/performance"
                  element={
                    <RequireRole allowedRole={ROLES.SUPER_ADMIN}>
                      <PerformancePage />
                    </RequireRole>
                  }
                />
                <Route
                  path="devops/health"
                  element={
                    <RequireRole allowedRole={ROLES.SUPER_ADMIN}>
                      <HealthPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="devops/infrastructure"
                  element={
                    <RequireRole allowedRole={ROLES.SUPER_ADMIN}>
                      <InfrastructurePage />
                    </RequireRole>
                  }
                />
                <Route
                  path="devops/database"
                  element={
                    <RequireRole allowedRole={ROLES.SUPER_ADMIN}>
                      <DatabasePage />
                    </RequireRole>
                  }
                />
                <Route
                  path="devops/containers"
                  element={
                    <RequireRole allowedRole={ROLES.SUPER_ADMIN}>
                      <ContainersPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="devops/deployments"
                  element={
                    <RequireRole allowedRole={ROLES.SUPER_ADMIN}>
                      <DeploymentsPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="devops/security"
                  element={
                    <RequireRole allowedRole={ROLES.SUPER_ADMIN}>
                      <SecurityPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="devops/alerts"
                  element={
                    <RequireRole allowedRole={ROLES.SUPER_ADMIN}>
                      <AlertsPage />
                    </RequireRole>
                  }
                />
                <Route
                  path="devops/access"
                  element={
                    <RequireRole allowedRole={ROLES.SUPER_ADMIN}>
                      <AccessManagementPage />
                    </RequireRole>
                  }
                />

                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
