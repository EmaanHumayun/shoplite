import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const RequireRole = ({ allowedRole = ROLES.SUPER_ADMIN, children }) => {
  const { isSuperAdmin } = useAuth();

  if (allowedRole === ROLES.SUPER_ADMIN && !isSuperAdmin) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--status-critical-bg)',
            color: 'var(--status-critical-text)',
            border: '1px solid var(--status-critical-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Access Restricted: Super Admin Role Required
        </h2>
        <p style={{ maxWidth: 460, color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '0.4rem', marginBottom: '1.5rem' }}>
          This section contains sensitive enterprise DevOps telemetry, PostgreSQL connection controls, and Trivy security auditing. Standard Administrators cannot access this route.
        </p>
        <div className="flex gap-3">
          <Link to="/">
            <Button variant="secondary" icon={ArrowLeft}>
              Return to Commerce Overview
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return children;
};
