import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Badge } from '../common/Badge';

export const TrafficAreaChart = ({ data = [] }) => {
  const [range, setRange] = useState('24h');

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            Web Traffic Throughput (Requests &amp; Visitors)
            <Badge variant="demo">[DEMO METRICS]</Badge>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time ingress requests filtered across edge Nginx Gateway
          </p>
        </div>
        <div className="segmented-control">
          {['24h', '7d', '30d'].map((r) => (
            <button
              key={r}
              type="button"
              className={`segmented-btn ${range === r ? 'active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#219ebc" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#8ecae6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
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
            <Area
              type="monotone"
              dataKey="requests"
              name="Requests"
              stroke="#219ebc"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#trafficGradient)"
            />
            <Area
              type="monotone"
              dataKey="visitors"
              name="Unique Sessions"
              stroke="#023047"
              strokeWidth={1.75}
              fillOpacity={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
