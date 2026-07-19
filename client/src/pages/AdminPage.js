import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

const ADMIN_NAV = [
  { label: 'Overview',      to: '/admin',                 icon: '⊞', end: true },
  { label: 'Inquiries',     to: '/admin/inquiries', icon: '📥' },
  { label: 'Programs',      to: '/admin/programs',        icon: '📋' },
  { label: 'Events',        to: '/admin/events',          icon: '📅' },
  { label: 'Announcements', to: '/admin/announcements',   icon: '📢' },
  { label: 'Resources',     to: '/admin/resources',       icon: '📁' },
  { label: 'Site Content',  to: '/admin/site-content', icon: '✏️' },
];

export default function AdminPage() {
  const { user, logout }              = useAuth();
  const navigate                      = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">

      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-header">
          <span className="admin-logo-text">CACOS</span>
          <span className="admin-role-badge">Admin</span>
        </div>

        <nav className="admin-nav">
          {ADMIN_NAV.map(({ label, to, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span className="admin-user-name">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="admin-user-email">{user?.email}</span>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-btn"
            onClick={() => setSidebarOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <h1 className="admin-topbar-title">
            Calgary Athletic Club Operations System
          </h1>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}