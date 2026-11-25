import React from 'react';
import { Menu, Search, Sun, Moon, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../common/Badge';

export const Header = ({ onToggleMobile, searchTerm, onSearchChange }) => {
  const { role, toggleRole, isSuperAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="top-navbar">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="btn-icon md:hidden"
          onClick={onToggleMobile}
          aria-label="Toggle Navigation"
        >
          <Menu size={18} />
        </button>

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

      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <button
          type="button"
          className="btn btn-secondary btn-sm flex items-center gap-1.5"
          onClick={toggleRole}
          title="Click to toggle between Super Admin and Admin role"
        >
          <Shield size={14} color={isSuperAdmin ? 'var(--status-healthy-text)' : 'var(--text-muted)'} />
          <span>Role: <strong>{isSuperAdmin ? 'Super Admin' : 'Admin'}</strong></span>
        </button>

        {/* Theme Toggle (Light / Dark) */}
        <button
          type="button"
          className="btn-icon"
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
