import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  FileText,
  Activity,
  Globe,
  Gauge,
  HeartPulse,
  Server,
  Database,
  Container,
  GitCommit,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  Settings,
  X,
  Shield
} from 'lucide-react';
import { Logo } from '../brand/Logo';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

export const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const { isSuperAdmin, role } = useAuth();

  const commerceNav = [
    { label: 'Executive Overview', path: '/', icon: LayoutDashboard },
    { label: 'Product Catalog', path: '/products', icon: Package },
    { label: 'Inventory Audit', path: '/inventory', icon: Boxes },
    { label: 'Orders Fulfillment', path: '/orders', icon: ShoppingCart },
    { label: 'Customer Directory', path: '/customers', icon: Users },
    { label: 'Reports & Exports', path: '/reports', icon: FileText },
  ];

  const devopsNav = [
    { label: 'Command Center', path: '/devops/overview', icon: Activity },
    { label: 'Traffic Analytics', path: '/devops/traffic', icon: Globe },
    { label: 'APM & Latency', path: '/devops/performance', icon: Gauge },
    { label: 'Service Health', path: '/devops/health', icon: HeartPulse },
    { label: 'Host Infrastructure', path: '/devops/infrastructure', icon: Server },
    { label: 'PostgreSQL Metrics', path: '/devops/database', icon: Database },
    { label: 'Docker Containers', path: '/devops/containers', icon: Container },
    { label: 'CI/CD Deployments', path: '/devops/deployments', icon: GitCommit },
  ];

  const securityNav = [
    { label: 'Security & Trivy', path: '/devops/security', icon: ShieldCheck },
    { label: 'Incident Alerts', path: '/devops/alerts', icon: AlertTriangle },
    { label: 'Access Control (RBAC)', path: '/devops/access', icon: KeyRound },
  ];

  return (
    <>
      {mobileOpen && (
        <div className="modal-backdrop" style={{ zIndex: 35 }} onClick={onCloseMobile} />
      )}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header justify-between">
          <Logo size="md" subtitle={isSuperAdmin ? 'Super Admin' : 'Admin Portal'} />
          {mobileOpen && (
            <button type="button" className="btn-icon" onClick={onCloseMobile} aria-label="Close sidebar">
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Commerce Operations</div>
          {commerceNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onCloseMobile}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {isSuperAdmin && (
            <>
              <div className="nav-section-title">DevOps Observability</div>
              {devopsNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={onCloseMobile}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              <div className="nav-section-title">Security &amp; Governance</div>
              {securityNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={onCloseMobile}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </>
          )}

          <div className="nav-section-title">System</div>
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onCloseMobile}
          >
            <Settings size={16} />
            <span>Architecture Specs</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Role Access:</span>
            <Badge variant={isSuperAdmin ? 'healthy' : 'info'}>
              {isSuperAdmin ? 'SUPER ADMIN' : 'BUSINESS ADMIN'}
            </Badge>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Cloud Crafters • Emaan &amp; Ishtiaq
          </div>
        </div>
      </aside>
    </>
  );
};
