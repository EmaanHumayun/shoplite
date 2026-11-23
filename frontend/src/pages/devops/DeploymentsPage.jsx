import React, { useState } from 'react';
import { GitBranch, GitCommit, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { DEPLOYMENT_HISTORY } from '../../services/devopsData';

export const DeploymentsPage = () => {
  const [deployments, setDeployments] = useState(DEPLOYMENT_HISTORY);
  const [rollbackStatus, setRollbackStatus] = useState(null);

  const handleSimulateRollback = (dep) => {
    setRollbackStatus(`Simulating rollback to commit ${dep.commit} (${dep.imageTag})...`);
    setTimeout(() => {
      setRollbackStatus(`Rollback completed successfully. EC2 production containers restored to ${dep.imageTag}.`);
      setTimeout(() => setRollbackStatus(null), 4000);
    }, 1500);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>CI/CD &amp; Deployment Operations</h1>
            <Badge variant="demo">[DEMO / SIMULATED WORKFLOWS]</Badge>
          </div>
          <p>GitHub Actions automated workflows, Trivy security verification, and EC2 image promotions</p>
        </div>
      </div>

      {rollbackStatus && (
        <div style={{ marginBottom: '1.5rem', padding: '0.85rem 1.25rem', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem' }}>
          <strong>Notice: </strong> {rollbackStatus}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">GitHub Actions Deployment History</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Workflow Pipeline</th>
                <th>Git Commit &amp; Branch</th>
                <th>Author</th>
                <th>Image Tag (ECR)</th>
                <th>Duration</th>
                <th>Deployed At</th>
                <th style={{ textAlign: 'right' }}>Rollback Safeguard</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((dep) => (
                <tr key={dep.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} color="var(--status-healthy-text)" />
                      <strong>{dep.workflow}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                      <GitCommit size={14} color="var(--text-muted)" />
                      <span>{dep.commit}</span>
                      <span className="badge badge-info" style={{ marginLeft: 4 }}>{dep.branch}</span>
                    </div>
                  </td>
                  <td>{dep.author}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{dep.imageTag}</td>
                  <td>{dep.duration}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{dep.deployedAt}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={RotateCcw}
                      onClick={() => handleSimulateRollback(dep)}
                    >
                      Rollback
                    </Button>
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
