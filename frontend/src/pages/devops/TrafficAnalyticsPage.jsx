import React from 'react';
import { Globe, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { TrafficAreaChart } from '../../components/charts/TrafficAreaChart';
import { HttpStatusPieChart } from '../../components/charts/HttpStatusPieChart';
import { StatCard } from '../../components/dashboard/StatCard';
import { Badge } from '../../components/common/Badge';
import {
  TRAFFIC_TREND_DATA,
  HTTP_STATUS_DISTRIBUTION,
  TOP_API_ENDPOINTS
} from '../../services/devopsData';

export const TrafficAnalyticsPage = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>Web Traffic &amp; Ingress Analytics</h1>
            <Badge variant="healthy">NGINX REAL-TIME METRICS</Badge>
          </div>
          <p>Nginx edge reverse proxy traffic volume, request rates, and HTTP status distribution</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard title="Requests Per Min (RPM)" value="1,450" meta="+8.4% vs peak" metaType="positive" icon={Globe} />
        <StatCard title="24h Active Visitors" value="14,280" meta="Unique IP sessions" metaType="positive" />
        <StatCard title="Bandwidth Transferred" value="84.6 GB" meta="Egress across Nginx" />
        <StatCard title="Success Rate (2xx)" value="97.6%" meta="Industry target &gt; 95%" metaType="positive" />
      </div>

      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '1.5rem' }}>
        <div style={{ gridColumn: 'span 2' }}>
          <TrafficAreaChart data={TRAFFIC_TREND_DATA} />
        </div>
        <div>
          <HttpStatusPieChart data={HTTP_STATUS_DISTRIBUTION} />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Top Microservice API Endpoints</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sorted by request frequency</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Method &amp; Path</th>
                <th>Target Microservice</th>
                <th style={{ textAlign: 'center' }}>Throughput (RPM)</th>
                <th style={{ textAlign: 'center' }}>Avg Latency</th>
                <th style={{ textAlign: 'right' }}>Error Rate</th>
              </tr>
            </thead>
            <tbody>
              {TOP_API_ENDPOINTS.map((ep, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="badge badge-info" style={{ fontFamily: 'var(--font-mono)' }}>{ep.method}</span>
                      <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{ep.path}</strong>
                    </div>
                  </td>
                  <td>{ep.service} Service</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{ep.rpm}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{ep.avgLatency}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{ep.errorRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
