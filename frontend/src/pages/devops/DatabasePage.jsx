import React from 'react';
import { Database, Zap, Clock, ShieldCheck } from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard';
import { Badge } from '../../components/common/Badge';

export const DatabasePage = () => {
  const slowQueries = [
    { query: "SELECT * FROM orders WHERE status = 'Processing' ORDER BY created_at DESC", calls: 420, avgMs: 14.2, status: "Optimized" },
    { query: "SELECT p.*, i.quantity FROM products p JOIN inventory i ON p.id = i.product_id", calls: 1840, avgMs: 4.8, status: "Indexed" },
    { query: "SELECT COUNT(*) FROM order_items WHERE order_id = $1", calls: 890, avgMs: 2.1, status: "Index Scan" }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>PostgreSQL Database Monitoring</h1>
            <Badge variant="healthy">POSTGRESQL 16 LIVE</Badge>
          </div>
          <p>Relational database connection pool, query execution latency, and automated backup status</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard title="Active Connections" value="24 / 50" meta="16 Idle • 10 Reserved" icon={Database} />
        <StatCard title="Cache Hit Ratio" value="98.6%" meta="Buffer cache nominal" metaType="positive" icon={Zap} />
        <StatCard title="Avg Query Latency" value="4.2ms" meta="PostgreSQL 16 Engine" metaType="positive" icon={Clock} />
        <StatCard title="WAL Backup Status" value="Healthy" meta="Daily automated snapshot" metaType="positive" icon={ShieldCheck} />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Top Database Queries (pg_stat_statements)</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>SQL Query Statement</th>
                <th style={{ textAlign: 'center' }}>Total Executions</th>
                <th style={{ textAlign: 'center' }}>Avg Duration</th>
                <th style={{ textAlign: 'right' }}>Plan Optimization</th>
              </tr>
            </thead>
            <tbody>
              {slowQueries.map((q, idx) => (
                <tr key={idx}>
                  <td>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{q.query}</code>
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{q.calls}</td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{q.avgMs} ms</td>
                  <td style={{ textAlign: 'right' }}>
                    <Badge variant="healthy">{q.status}</Badge>
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
