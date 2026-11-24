import React from 'react';
import { Cpu, HardDrive, Wifi, Server } from 'lucide-react';
import { ResourceLineChart } from '../../components/charts/ResourceLineChart';
import { StatCard } from '../../components/dashboard/StatCard';
import { Badge } from '../../components/common/Badge';
import { RESOURCE_UTILIZATION, CONTAINER_FLEET } from '../../services/devopsData';

export const InfrastructurePage = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>Infrastructure &amp; Host Telemetry</h1>
            <Badge variant="demo">[DEMO METRICS]</Badge>
          </div>
          <p>AWS EC2 instance compute utilization, memory pressure, and Docker runtime allocation</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard title="Host CPU Core Load" value="35%" meta="4 vCPUs allocated" icon={Cpu} />
        <StatCard title="Memory (RAM) Allocated" value="4.1 / 8.0 GB" meta="51.2% in active use" />
        <StatCard title="NVMe Disk Storage" value="42% (33.6 GB)" meta="80 GB EBS gp3 volume" icon={HardDrive} />
        <StatCard title="Network Ingress / Egress" value="18.4 MB/s" meta="VPC peering active" icon={Wifi} />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <ResourceLineChart data={RESOURCE_UTILIZATION} />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Docker Host Container Resource Allocation</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Container Name</th>
                <th>Docker Image</th>
                <th style={{ textAlign: 'center' }}>CPU Usage</th>
                <th style={{ textAlign: 'center' }}>Memory Limit</th>
                <th style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {CONTAINER_FLEET.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{c.image}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{c.cpu}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{c.mem}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Badge variant="healthy">RUNNING</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
