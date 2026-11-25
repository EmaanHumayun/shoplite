import React from 'react';
import { Menu, Search, Sun, Moon, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../brand/Logo';
import { Badge } from '../common/Badge';

export const Header = ({ onToggleMobile, searchTerm, onSearchChange }) => {
  const { role, toggleRole, isSuperAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="top-navbar">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          className="btn-icon mobile-menu-toggle"
          onClick={onToggleMobile}
          aria-label="Open Navigation"
          title="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Brand Emblem (visible only on mobile) */}
        <div className="mobile-brand-emblem">
          <Logo size="sm" subtitle={null} />
        </div>

        {/* Global Search Bar */}
        <div className="search-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products, orders, inventory, SKU..."
            value={searchTerm || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        {/* Role Switcher Pill */}
        <button
          type="button"
          className="btn btn-secondary btn-sm flex items-center gap-1.5 role-switcher-btn"
          onClick={toggleRole}
          title="Click to toggle between Super Admin and Admin role"
        >
          <Shield size={14} color={isSuperAdmin ? 'var(--status-healthy-text)' : 'var(--text-muted)'} />
          <span className="role-text-full">Role: <strong>{isSuperAdmin ? 'Super Admin' : 'Admin'}</strong></span>
          <span className="role-text-mobile"><strong>{isSuperAdmin ? 'Super' : 'Admin'}</strong></span>
        </button>

        {/* Theme Toggle (Light / Dark) */}
        <button
          type="button"
          className="btn-icon theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle dark/light theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};
