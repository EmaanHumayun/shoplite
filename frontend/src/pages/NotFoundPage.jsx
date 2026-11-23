import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: '65vh',
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
          fontSize: '5rem',
          fontWeight: 800,
          color: 'var(--primary-200)',
          fontFamily: 'var(--font-serif)',
          lineHeight: 1,
        }}
      >
        404
      </div>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-900)', marginTop: '0.5rem' }}>
        Page Not Found
      </h2>
      <p style={{ maxWidth: 440, color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.75rem' }}>
        The section you requested does not exist in the ShopLite product management portal. Please return to the dashboard.
      </p>
      <Link to="/">
        <Button variant="primary" icon={Home}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
