import React, { useState } from 'react';
import { Search, UserCheck, Mail, ShoppingBag } from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { formatCurrency } from '../utils/formatters';
import { CUSTOMER_DIRECTORY } from '../services/devopsData';

export const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = CUSTOMER_DIRECTORY.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Customer Management</h1>
          <p>Customer accounts, lifetime purchasing value, and transaction history</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div className="search-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th style={{ textAlign: 'center' }}>Total Orders</th>
              <th style={{ textAlign: 'right' }}>Lifetime Spend</th>
              <th>Tier</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust) => (
              <tr key={cust.id}>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{cust.id}</span></td>
                <td><strong>{cust.name}</strong></td>
                <td style={{ color: 'var(--text-muted)' }}>{cust.email}</td>
                <td style={{ textAlign: 'center' }}><strong>{cust.ordersCount}</strong></td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(cust.totalSpend)}</td>
                <td>
                  <Badge variant={cust.status === 'VIP' ? 'healthy' : 'info'}>
                    {cust.status}
                  </Badge>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cust.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
