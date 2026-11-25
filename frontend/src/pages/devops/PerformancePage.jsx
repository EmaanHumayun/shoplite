import React from 'react';
import { Gauge, Clock, AlertOctagon } from 'lucide-react';
import { LatencyLineChart } from '../../components/charts/LatencyLineChart';
import { StatCard } from '../../components/dashboard/StatCard';
import { Badge } from '../../components/common/Badge';
import { LATENCY_PERCENTILES, TOP_API_ENDPOINTS } from '../../services/devopsData';

export const PerformancePage = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>Application Performance Monitoring (APM)</h1>
            <Badge variant="healthy">APM ENGINE ACTIVE</Badge>
          </div>
          <p>Microservice response latencies, percentile distributions, and tail anomaly tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard title="p50 Median Latency" value="22ms" meta="Excellent" metaType="positive" icon={Clock} />
        <StatCard title="p95 Tail Latency" value="84ms" meta="Within SLA (<100ms)" metaType="positive" icon={Gauge} />
        <StatCard title="p99 Worst-Case" value="188ms" meta="DB query spikes" icon={AlertOctagon} />
        <StatCard title="Global Error Rate" value="0.12%" meta="Target < 0.5%" metaType="positive" />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <LatencyLineChart data={LATENCY_PERCENTILES} />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Endpoint Latency Performance SLA</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Endpoint</th>
                <th style={{ textAlign: 'center' }}>SLA Target</th>
                <th style={{ textAlign: 'center' }}>Measured p95</th>
                <th style={{ textAlign: 'right' }}>SLA Compliance</th>
              </tr>
            </thead>
            <tbody>
              {TOP_API_ENDPOINTS.map((ep, idx) => (
                <tr key={idx}>
                  <td><strong>{ep.service}</strong></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{ep.path}</td>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>&lt; 150ms</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{ep.avgLatency}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Badge variant="healthy">100% PASS</Badge>
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
