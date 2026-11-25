import React, { useState } from 'react';
import { Box, Play, Square, RotateCcw, Terminal } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CONTAINER_FLEET } from '../../services/devopsData';

export const ContainersPage = () => {
  const [selectedContainer, setSelectedContainer] = useState(CONTAINER_FLEET[0]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>Docker &amp; Container Fleet Management</h1>
            <Badge variant="healthy">CONTAINER ENGINE 26.0</Badge>
          </div>
          <p>Microservice container lifecycle, image tags, port bindings, and runtime stdout logs</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title">Active Container Fleet ({CONTAINER_FLEET.length} Running)</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Container Name</th>
                <th>Image Tag</th>
                <th>Port Mapping</th>
                <th style={{ textAlign: 'center' }}>Restarts</th>
                <th style={{ textAlign: 'center' }}>CPU / Mem</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {CONTAINER_FLEET.map((c) => (
                <tr key={c.id} style={{ backgroundColor: selectedContainer.id === c.id ? 'var(--bg-subtle)' : 'transparent' }}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="status-pip status-pip-healthy" />
                      <strong>{c.name}</strong>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{c.image}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{c.port}</td>
                  <td style={{ textAlign: 'center' }}>{c.restarts}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{c.cpu} / {c.mem}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Terminal}
                      onClick={() => setSelectedContainer(c)}
                    >
                      Inspect Logs
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Container Log Console */}
      <div className="terminal-card">
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <div className="terminal-dots">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
            </div>
            <span style={{ color: '#a1a1aa', fontSize: '0.74rem', fontWeight: 600 }}>
              docker logs -f {selectedContainer.name} (Container ID: {selectedContainer.id})
            </span>
          </div>
          <Badge variant="healthy">LIVE CONTAINER STDOUT</Badge>
        </div>
        <div className="terminal-body">
          <div className="terminal-line">
            <span className="terminal-time">20:25:01.104</span>
            <span className="terminal-prefix">[SYSTEM]</span>
            <span className="terminal-text-success">Container {selectedContainer.name} initialized with entrypoint exec</span>
          </div>
          <div className="terminal-line">
            <span className="terminal-time">20:25:02.340</span>
            <span className="terminal-prefix">[RUNTIME]</span>
            <span className="terminal-text-info">Listening on internal port {selectedContainer.port.split(':')[0]}</span>
          </div>
          <div className="terminal-line">
            <span className="terminal-time">20:25:05.112</span>
            <span className="terminal-prefix">[NETWORK]</span>
            <span className="terminal-text-info">Connected to backend-net bridge (IPv4: 172.28.0.{selectedContainer.id.slice(-1)})</span>
          </div>
          <div className="terminal-line">
            <span className="terminal-time">20:25:10.892</span>
            <span className="terminal-prefix">[HEALTHCHECK]</span>
            <span className="terminal-text-success">HTTP probe GET /health responded with 200 OK (latency: 4.8ms)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
