import React from 'react';
import { ShieldAlert, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { StatCard } from '../../components/dashboard/StatCard';
import { Badge } from '../../components/common/Badge';
import { TRIVY_SECURITY_FINDINGS } from '../../services/devopsData';

export const SecurityPage = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>Security Center &amp; Vulnerability Auditing</h1>
            <Badge variant="demo">[DEMO TRIVY FINDINGS]</Badge>
          </div>
          <p>Trivy static container scanning, open-source dependency auditing, and CVE vulnerability triage</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard title="Critical CVEs" value="0" meta="Zero Critical Findings" metaType="positive" icon={ShieldCheck} />
        <StatCard title="High Severity" value="1" meta="cross-spawn audited" metaType="warning" icon={ShieldAlert} />
        <StatCard title="Medium Findings" value="2" meta="Remediation scheduled" />
        <StatCard title="Container Security" value="Pass" meta="Non-root users active" metaType="positive" icon={Lock} />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Trivy Container Scan Findings (SARIF Export)</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vulnerability ID</th>
                <th>Severity</th>
                <th>Affected Package</th>
                <th>Target Service</th>
                <th>Installed Version</th>
                <th>Patched In</th>
                <th style={{ textAlign: 'right' }}>Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {TRIVY_SECURITY_FINDINGS.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{item.id}</strong>
                  </td>
                  <td>
                    <Badge variant={item.severity === 'HIGH' ? 'warning' : 'info'}>
                      {item.severity}
                    </Badge>
                  </td>
                  <td><code style={{ fontFamily: 'var(--font-mono)' }}>{item.pkg}</code></td>
                  <td>{item.service}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{item.installed}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--status-healthy-text)' }}>{item.fixed}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Badge variant="healthy">{item.status}</Badge>
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
