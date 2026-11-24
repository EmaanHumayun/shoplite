import React from 'react';
import { Activity, Server, ShieldCheck, GitCommit, AlertTriangle, ArrowUpRight, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/dashboard/StatCard';
import { TrafficAreaChart } from '../../components/charts/TrafficAreaChart';
import { HttpStatusPieChart } from '../../components/charts/HttpStatusPieChart';
import { Badge } from '../../components/common/Badge';
import {
  SYSTEM_HEALTH_METRICS,
  TRAFFIC_TREND_DATA,
  HTTP_STATUS_DISTRIBUTION,
  ACTIVE_ALERTS,
  DEPLOYMENT_HISTORY
} from '../../services/devopsData';

export const SystemOverviewPage = () => {
  const healthyCount = SYSTEM_HEALTH_METRICS.filter(s => s.status === 'healthy').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>DevOps Command Center</h1>
            <Badge variant="healthy" className="flex items-center gap-1">
              <span className="status-pip status-pip-healthy" />
              SYSTEMS OPTIMAL
            </Badge>
            <Badge variant="demo">[DEMO / SAMPLE TELEMETRY]</Badge>
          </div>
          <p>Real-time multi-service telemetry, container fleet health, and cloud infrastructure</p>
        </div>
      </div>

      {/* Top Level DevOps KPI Strip */}
      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          title="Active Services"
          value={`${healthyCount} / ${SYSTEM_HEALTH_METRICS.length}`}
          meta="All microservices nominal"
          metaType="positive"
          icon={Server}
        />
        <StatCard
          title="Platform Uptime"
          value="99.98%"
          meta="Past 30 calendar days"
          metaType="positive"
          icon={Activity}
        />
        <StatCard
          title="Host CPU / RAM"
          value="34% / 52%"
          meta="AWS EC2 t3.xlarge instance"
          icon={Cpu}
        />
        <StatCard
          title="Active Alerts"
          value={ACTIVE_ALERTS.length}
          meta="0 Critical • 1 Warning • 1 Info"
          metaType="positive"
          icon={AlertTriangle}
        />
      </div>

      {/* Central Visualizations */}
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '1.5rem' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <TrafficAreaChart data={TRAFFIC_TREND_DATA} />
        </div>
        <div>
          <HttpStatusPieChart data={HTTP_STATUS_DISTRIBUTION} />
        </div>
      </div>

      {/* Service Health Cards Matrix */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              Microservice Topology &amp; Health Matrix
              <Badge variant="demo">[DEMO METRICS]</Badge>
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Integrated healthchecks spanning Nginx, Node.js Catalog, Go Inventory, Spring Boot Orders &amp; PostgreSQL
            </p>
          </div>
          <Link to="/devops/health">
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Deep Health Inspector &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {SYSTEM_HEALTH_METRICS.map((svc) => (
            <div
              key={svc.id}
              style={{
                padding: '0.85rem 1rem',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{svc.name}</span>
                <span className="status-pip status-pip-healthy" />
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {svc.endpoint}
              </div>
              <div className="flex items-center justify-between" style={{ marginTop: 8, fontSize: '0.74rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Latency: <strong>{svc.latencyMs}ms</strong></span>
                <span style={{ color: 'var(--status-healthy-text)', fontWeight: 600 }}>{svc.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Deployments & Terminal Activity */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent CI/CD Deployments</h3>
            <Link to="/devops/deployments" style={{ fontSize: '0.8rem', fontWeight: 600 }}>View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {DEPLOYMENT_HISTORY.map((dep) => (
              <div
                key={dep.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface)'
                }}
              >
                <div className="flex items-center gap-2.5">
                  <GitCommit size={16} color="var(--text-muted)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{dep.workflow}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      SHA: {dep.commit} • Branch: {dep.branch}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge variant="healthy">{dep.status}</Badge>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{dep.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Container Log Preview */}
        <div className="terminal-card">
          <div className="terminal-header">
            <div className="flex items-center gap-2">
              <div className="terminal-dots">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
              </div>
              <span style={{ color: '#a1a1aa', fontSize: '0.72rem', fontWeight: 600 }}>nginx-gateway.log — Live Ingress Stream</span>
            </div>
            <Badge variant="demo">[SIMULATED STREAM]</Badge>
          </div>
          <div className="terminal-body">
            <div className="terminal-line">
              <span className="terminal-time">20:24:12</span>
              <span className="terminal-prefix">[NGINX]</span>
              <span className="terminal-text-success">GET /api/products HTTP/1.1 200 2.4kb 24ms</span>
            </div>
            <div className="terminal-line">
              <span className="terminal-time">20:24:15</span>
              <span className="terminal-prefix">[CATALOG]</span>
              <span className="terminal-text-info">PG connection acquired from pool. Query executed in 4.2ms</span>
            </div>
            <div className="terminal-line">
              <span className="terminal-time">20:24:18</span>
              <span className="terminal-prefix">[INVENTORY]</span>
              <span className="terminal-text-info">Go net/http GET /api/inventory/SHP-LTH-01 returned stock: 24</span>
            </div>
            <div className="terminal-line">
              <span className="terminal-time">20:24:22</span>
              <span className="terminal-prefix">[ORDERS]</span>
              <span className="terminal-text-info">Spring Boot transaction verified for customer ORD-8941</span>
            </div>
            <div className="terminal-line">
              <span className="terminal-time">20:24:28</span>
              <span className="terminal-prefix">[CERTBOT]</span>
              <span className="terminal-text-success">SSL certificate status: VALID (Let&#39;s Encrypt ECC)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
