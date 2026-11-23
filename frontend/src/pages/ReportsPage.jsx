import React, { useState } from 'react';
import { FileText, Download, Check } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const ReportsPage = () => {
  const [downloaded, setDownloaded] = useState(null);

  const handleExport = (reportName) => {
    setDownloaded(reportName);
    setTimeout(() => setDownloaded(null), 3000);
  };

  const reports = [
    { title: "Monthly Gross Revenue & Sales Tax Report", period: "Nov 2026", format: "CSV / Excel", size: "142 KB" },
    { title: "Inventory Valuation & COGS Audit", period: "Q4 2026", format: "CSV", size: "86 KB" },
    { title: "Customer Order Fulfillment SLA Summary", period: "Last 30 Days", format: "PDF / CSV", size: "210 KB" },
    { title: "Product Catalog Margin Analysis", period: "Annual 2026", format: "CSV", size: "94 KB" }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Business Reports &amp; Data Exports</h1>
          <p>Financial ledger summaries, stock valuation audits, and CSV export automation</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reports.map((rep, idx) => (
          <div key={idx} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 600 }}>{rep.title}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Period: <strong>{rep.period}</strong> • Format: {rep.format} ({rep.size})
                  </div>
                </div>
              </div>

              <div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={downloaded === rep.title ? Check : Download}
                  onClick={() => handleExport(rep.title)}
                >
                  {downloaded === rep.title ? 'Exported' : 'Export Data'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
