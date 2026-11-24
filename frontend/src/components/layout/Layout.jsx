import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="app-container">
      <Sidebar 
        mobileOpen={mobileOpen} 
        onCloseMobile={() => setMobileOpen(false)} 
      />
      <div className="main-wrapper">
        <Header 
          onToggleMobile={() => setMobileOpen(!mobileOpen)} 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <main className="page-content">
          <Outlet context={{ searchTerm }} />
        </main>
      </div>
    </div>
  );
};
