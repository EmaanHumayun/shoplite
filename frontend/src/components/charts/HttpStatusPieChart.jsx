import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Badge } from '../common/Badge';

export const HttpStatusPieChart = ({ data = [] }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            HTTP Ingress Status Codes
            <Badge variant="demo">[DEMO METRICS]</Badge>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Nginx reverse proxy response code breakdown
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', height: 260 }}>
        <div style={{ flex: 1, height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="percentage"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-default)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: 140, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.78rem' }}>
          {data.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: item.color }} />
                <span style={{ fontWeight: 500 }}>{item.status.split(' ')[0]}</span>
              </div>
              <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{item.percentage}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
