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

export const ResourceLineChart = ({ data = [] }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            AWS EC2 Host Resource Utilization
            <Badge variant="demo">[DEMO METRICS]</Badge>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Aggregate CPU, RAM and NVMe Disk consumption across Docker runtime
          </p>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
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
            <Line type="monotone" dataKey="cpu" name="CPU Core Load" stroke="#219ebc" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="memory" name="Memory (RAM)" stroke="#ffb703" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="disk" name="Disk Storage" stroke="#023047" strokeWidth={1.8} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
