import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';
import ChatWidget from '../components/ChatWidget';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ADMIN_NAV = [
  { label: 'Overview',      to: '/admin',                 icon: '⊞', end: true },
  { label: 'Inquiries',     to: '/admin/inquiries', icon: '📥' },
  { label: 'Members',       to: '/admin/members', icon: '👥' },
  { label: 'Programs',      to: '/admin/programs',        icon: '📋' },
  { label: 'Events',        to: '/admin/events',          icon: '📅' },
  { label: 'Announcements', to: '/admin/announcements',   icon: '📢' },
  { label: 'Resources',     to: '/admin/resources',       icon: '📁' },
  { label: 'Club Records',  to: '/admin/records',         icon: '🏆' },
  { label: 'Site Content',  to: '/admin/site-content', icon: '✏️' },
];

export default function AdminPage() {
  const { user, token, logout }       = useAuth();
  const navigate                      = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Re-verify against the live database every time this page loads — a demoted
  // or deactivated admin should be kicked out immediately, not only once their
  // original token happens to expire or they manually log out.
  useEffect(() => {
    const verifyStillAdmin = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || data.user?.role !== 'admin') {
          logout();
          navigate('/login');
        }
      } catch (err) {
        // Network hiccup — don't force a logout over a transient error.
      }
    };
    if (token) verifyStillAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-header">
          <span className="admin-logo-text">Admin Portal</span>
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
          <span className="admin-topbar-label">Admin Portal</span>
          <Link to="/" className="admin-exit-link" aria-label="Back to site">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </Link>
        </header>

        <main className="admin-content">
          <Outlet />
          <ChatWidget mode="admin" />
          </main>
      </div>
    </div>
  );
}