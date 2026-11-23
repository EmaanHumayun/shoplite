import React from 'react';

export const StatCard = ({ title, value, meta, metaType = 'neutral', icon: Icon, colorTheme = 'burgundy' }) => {
  const iconThemeClass = {
    burgundy: 'icon-burgundy',
    gold: 'icon-gold',
    emerald: 'icon-emerald',
    amber: 'icon-amber',
  }[colorTheme] || 'icon-burgundy';

  return (
    <div className="stat-card">
      <div>
        <div className="stat-card-title">{title}</div>
        <div className="stat-card-value">{value}</div>
        {meta && (
          <div className="stat-card-meta">
            <span style={{ 
              color: metaType === 'positive' ? 'var(--status-success-text)' : 
                     metaType === 'negative' ? 'var(--status-danger-text)' : 'var(--text-muted)',
              fontWeight: 600
            }}>
              {meta}
            </span>
          </div>
        )}
      </div>
      {Icon && (
        <div className={`stat-card-icon ${iconThemeClass}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
};
