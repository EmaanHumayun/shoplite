import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Badge } from '../common/Badge';

export const LatencyLineChart = ({ data = [] }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            API Latency Distribution (Percentiles)
            <Badge variant="demo">[DEMO METRICS]</Badge>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Microservices edge latency: Median (p50), Tail (p95), and Worst-case (p99)
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} unit="ms" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-default)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '12px',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
            <Line type="monotone" dataKey="p50" name="p50 (Median)" stroke="#8ecae6" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="p95" name="p95 (95th %ile)" stroke="#219ebc" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="p99" name="p99 (Tail Spike)" stroke="#fb8500" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
