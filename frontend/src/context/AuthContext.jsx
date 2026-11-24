import React, { createContext, useContext, useState } from 'react';

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
};

const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    'view:dashboard',
    'manage:products',
    'manage:inventory',
    'manage:orders',
    'view:customers',
    'view:reports',
    'view:devops',
    'view:infrastructure',
    'manage:database',
    'manage:deployments',
    'manage:security',
    'manage:users',
    'manage:settings',
  ],
  [ROLES.ADMIN]: [
    'view:dashboard',
    'manage:products',
    'manage:inventory',
    'manage:orders',
    'view:customers',
    'view:reports',
  ],
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(ROLES.SUPER_ADMIN); // Default to Super Admin for full observability inspection

  const user = {
    name: 'Cloud Crafters',
    email: 'ops@cloudcrafters.internal',
    coordinator: 'Emaan Humayun',
    techLead: 'Ishtiaq Ahmad',
    role,
  };

  const hasPermission = (permission) => {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  };

  const isSuperAdmin = role === ROLES.SUPER_ADMIN;

  const toggleRole = () => {
    setRole((prev) => (prev === ROLES.SUPER_ADMIN ? ROLES.ADMIN : ROLES.SUPER_ADMIN));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setRole,
        toggleRole,
        isSuperAdmin,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
