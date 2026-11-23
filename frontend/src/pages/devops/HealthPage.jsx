import React from 'react';
import { Server, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { SYSTEM_HEALTH_METRICS } from '../../services/devopsData';

export const HealthPage = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>Microservice Topology &amp; Health Status</h1>
            <Badge variant="demo">[DEMO METRICS]</Badge>
          </div>
          <p>Real-time distributed healthchecks, network latency, and service dependency graph</p>
        </div>
        <Button variant="secondary" icon={RefreshCw} onClick={() => window.location.reload()}>
          Poll Endpoints
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {SYSTEM_HEALTH_METRICS.map((svc) => (
          <div key={svc.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Server size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{svc.name}</h3>
                    <Badge variant="healthy" className="flex items-center gap-1">
                      <span className="status-pip status-pip-healthy" />
                      HEALTHY
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Runtime: <strong>{svc.runtime}</strong> • Endpoint: <span style={{ fontFamily: 'var(--font-mono)' }}>{svc.endpoint}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', textAlign: 'right' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Latency</div>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{svc.latencyMs} ms</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Uptime</div>
                  <strong style={{ color: 'var(--status-healthy-text)' }}>{svc.uptime}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Last Check</div>
                  <span>{svc.lastChecked}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              <span>Downstream Dependencies: </span>
              {svc.dependencies.map((dep, idx) => (
                <span key={idx} className="badge badge-info" style={{ marginLeft: 6 }}>{dep}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
