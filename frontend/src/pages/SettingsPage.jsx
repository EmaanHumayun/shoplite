import React from 'react';
import { Server, Database, Shield, Radio, CheckCircle, Users } from 'lucide-react';
import { API_CONFIG } from '../services/api';
import { Badge } from '../components/common/Badge';

export const SettingsPage = () => {
  const microservices = [
    {
      name: 'Catalog Service',
      tech: 'Node.js + Express',
      port: '4000',
      configuredUrl: API_CONFIG.catalogUrl,
      role: 'Product catalog CRUD & categories',
      status: 'Ready for Connection',
    },
    {
      name: 'Inventory Service',
      tech: 'Go (Golang)',
      port: '5000',
      configuredUrl: API_CONFIG.inventoryUrl,
      role: 'Real-time stock reservation & threshold alerts',
      status: 'Ready for Connection',
    },
    {
      name: 'Orders Service',
      tech: 'Java Spring Boot',
      port: '8080',
      configuredUrl: API_CONFIG.ordersUrl,
      role: 'Transaction orchestration & order lifecycle',
      status: 'Ready for Connection',
    },
    {
      name: 'PostgreSQL Database',
      tech: 'PostgreSQL 16 (Docker)',
      port: '5432 (Internal)',
      configuredUrl: 'postgres://shoplite_user:***@db:5432/shoplite_db',
      role: 'Relational data persistence on internal backend-net',
      status: 'Schema Pending',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Platform Architecture &amp; Settings</h1>
          <p>Cloud Crafters microservices connectivity and environment configurations</p>
        </div>
      </div>

      {/* Team Information Banner */}
      <div className="card" style={{ marginBottom: '1.75rem', borderLeft: '4px solid var(--primary-700)' }}>
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-900)' }}>Cloud Crafters Development Team</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Project Coordinator: <strong>Emaan Humayun</strong> • Technical Lead: <strong>Ishtiaq Ahmad</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Microservices Blueprint Card */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Microservice Endpoints Status</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Environment variable bindings for local development and Nginx reverse proxy
            </p>
          </div>
          <Badge variant="warning">Fallback Mock Active</Badge>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {microservices.map((svc, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.15rem',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
              }}
            >
              <div className="flex items-center gap-3">
                <Server size={18} color="var(--primary-700)" />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {svc.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Stack: <strong>{svc.tech}</strong> • {svc.role}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary-800)' }}>
                  {svc.configuredUrl}
                </div>
                <div style={{ marginTop: 2 }}>
                  <Badge variant="info">{svc.status}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Deployment Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
            <Shield size={18} color="var(--gold-600)" />
            <h3 className="card-title" style={{ fontSize: '0.98rem' }}>Production Infrastructure</h3>
          </div>
          <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <li>• <strong>Containerization:</strong> Multi-stage Docker with non-root Nginx user</li>
            <li>• <strong>Security Scanning:</strong> Trivy automated vulnerability audits</li>
            <li>• <strong>CI/CD:</strong> GitHub Actions with AWS OIDC authentication</li>
            <li>• <strong>SSL Automation:</strong> Non-interactive Let's Encrypt / Certbot renewal</li>
          </ul>
        </div>

        <div className="card">
          <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
            <Database size={18} color="var(--primary-700)" />
            <h3 className="card-title" style={{ fontSize: '0.98rem' }}>Network Isolation</h3>
          </div>
          <ul style={{ listStyle: 'none', fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <li>• <strong>frontend-net:</strong> Accessible to Nginx port 80/443</li>
            <li>• <strong>backend-net:</strong> Internal non-routable network for APIs &amp; DB</li>
            <li>• <strong>Zero Secrets Exposure:</strong> Environment variables mapped via Docker Compose</li>
            <li>• <strong>Data Persistence:</strong> Dedicated named Docker volume for PostgreSQL</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
