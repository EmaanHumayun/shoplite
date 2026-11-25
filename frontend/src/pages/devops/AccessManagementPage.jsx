import React, { useState } from 'react';
import { UserCheck, Shield, Key } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { USER_ACCOUNTS } from '../../services/devopsData';

export const AccessManagementPage = () => {
  const [users, setUsers] = useState(USER_ACCOUNTS);

  const toggleUserRole = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          role: u.role === 'super_admin' ? 'admin' : 'super_admin'
        };
      }
      return u;
    }));
  };

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          status: u.status === 'active' ? 'suspended' : 'active'
        };
      }
      return u;
    }));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1>User &amp; Role-Based Access Control (RBAC)</h1>
            <Badge variant="healthy">ACTIVE POLICY</Badge>
          </div>
          <p>Super Admin authorization privileges, team role assignments, and authentication audit logs</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Authorized Team Accounts</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Identity</th>
                <th>Assigned Role</th>
                <th>Account Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'right' }}>Role Toggle</th>
                <th style={{ textAlign: 'right' }}>Account Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div>
                      <strong>{u.name}</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                  </td>
                  <td>
                    <Badge variant={u.role === 'super_admin' ? 'info' : 'healthy'}>
                      {u.role === 'super_admin' ? 'SUPER ADMIN' : 'BUSINESS ADMIN'}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={u.status === 'active' ? 'healthy' : 'critical'}>
                      {u.status}
                    </Badge>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.lastActive}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Button variant="secondary" size="sm" onClick={() => toggleUserRole(u.id)}>
                      Set to {u.role === 'super_admin' ? 'Admin' : 'Super Admin'}
                    </Button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant={u.status === 'active' ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => toggleStatus(u.id)}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
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
