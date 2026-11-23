import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, BellRing } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ACTIVE_ALERTS } from '../../services/devopsData';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState(ACTIVE_ALERTS);

  const handleAcknowledge = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>Alerts &amp; Incident Management</h1>
            <Badge variant="demo">[DEMO ALERTS]</Badge>
          </div>
          <p>Real-time threshold breaches, service degradation alerts, and automated operational triggers</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="card"
            style={{
              borderLeft: alert.severity === 'critical' ? '4px solid #ef4444' :
                          alert.severity === 'warning' ? '4px solid #eab308' : '4px solid #71717a'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} color={alert.severity === 'warning' ? 'var(--status-warning-text)' : 'var(--text-primary)'} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 600 }}>{alert.title}</h3>
                    <Badge variant={alert.severity === 'warning' ? 'warning' : 'info'}>{alert.severity}</Badge>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{alert.timestamp}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>{alert.message}</p>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Origin: <strong>{alert.service}</strong>
                  </div>
                </div>
              </div>

              <div>
                {alert.acknowledged ? (
                  <Badge variant="healthy">Acknowledged</Badge>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => handleAcknowledge(alert.id)}>
                    Acknowledge
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
