import React, { useEffect, useState } from 'react';
import { LogoIcon } from '../brand/Logo';

const STATUS_MESSAGES = [
  'Initializing Secure Microservices Gateway...',
  'Connecting to AWS ap-southeast-2 Cloud Cluster...',
  'Synchronizing Real-Time Product Catalog...',
  'Checking Inventory Pools & Node Availability...',
  'Streaming Live Enterprise Commerce Telemetry...',
  'Workspace Ready — Welcome to ShopLite'
];

/**
 * Enterprise Production-Grade App Loader
 * Features glowing pulse rings, logo floating effect, dynamic status ticker, and shimmering progress bar.
 */
export const AppLoader = ({
  fullScreen = false,
  message = null,
  progress = null,
  className = ''
}) => {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1100);
    return () => clearInterval(interval);
  }, [message]);

  const currentMessage = message || STATUS_MESSAGES[statusIndex];

  return (
    <div
      className={`app-loader-container ${fullScreen ? 'app-loader-fullscreen' : 'app-loader-inline'} ${className}`.trim()}
    >
      {/* Ambient background glow orb */}
      <div className="app-loader-glow-orb" />

      {/* Brand Emblem with Dual Glowing Rings */}
      <div className="app-loader-emblem-wrapper">
        <div className="app-loader-pulse-ring app-loader-pulse-ring-outer" />
        <div className="app-loader-pulse-ring app-loader-pulse-ring-inner" />
        
        <div className="app-loader-logo-core">
          <LogoIcon size={44} className="app-loader-logo-svg" />
        </div>
      </div>

      {/* Brand Name with Metallic Shimmer */}
      <div className="app-loader-text-group">
        <h2 className="app-loader-brand-title">
          ShopLite
          <span className="app-loader-badge">ENTERPRISE</span>
        </h2>
        <span className="app-loader-subtitle">CLOUD COMMERCE PLATFORM</span>
      </div>

      {/* Glowing Progress Track */}
      <div className="app-loader-track-wrapper">
        <div className="app-loader-track">
          <div
            className={`app-loader-progress ${progress !== null ? 'app-loader-progress-manual' : 'app-loader-progress-animated'}`}
            style={progress !== null ? { width: `${progress}%` } : {}}
          />
        </div>
      </div>

      {/* Dynamic Status Ticker */}
      <div className="app-loader-status-wrapper">
        <span className="status-pip status-pip-healthy app-loader-status-pip" />
        <p className="app-loader-status-text" key={currentMessage}>
          {currentMessage}
        </p>
      </div>
    </div>
  );
};
