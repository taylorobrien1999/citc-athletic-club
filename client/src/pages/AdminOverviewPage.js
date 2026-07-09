import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import './AdminOverviewPage.css';

// Stat cards — values are placeholders until APIs are wired in Sprint 2
const STATS = [
  { label: 'Programs',      value: '—', icon: '📋', to: '/admin/programs' },
  { label: 'Events',        value: '—', icon: '📅', to: '/admin/events' },
  { label: 'Announcements', value: '—', icon: '📢', to: '/admin/announcements' },
];

// Quick actions — links to the main work areas
const QUICK_ACTIONS = [
  { label: 'View Registration Inquiries', to: '/admin/inquiries',      icon: '📥' },
  { label: 'Manage Announcements',        to: '/admin/announcements', icon: '📢' },
  { label: 'Upload Resources',            to: '/admin/resources',     icon: '📁' },
  { label: 'Review Feedback',             to: '/admin/feedback',      icon: '💬' },
];

export default function AdminOverviewPage() {
  const { user } = useAuth();

  return (
    <div className="overview">

      {/* Welcome */}
      <div className="overview-welcome">
        <h2 className="overview-heading">
          Welcome back, {user?.firstName || 'Admin'}.
        </h2>
        <p className="overview-sub">
          Here's a snapshot of the Calgary International Track Club system.
        </p>
      </div>

      {/* Stat cards */}
      <div className="overview-stats">
        {STATS.map((s) => (
          <NavLink to={s.to} key={s.label} className="stat-card">
            <span className="stat-icon">{s.icon}</span>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </NavLink>
        ))}
      </div>

      {/* Quick actions */}
      <div className="overview-section">
        <h3 className="overview-section-title">Quick Actions</h3>
        <div className="quick-actions">
          {QUICK_ACTIONS.map((a) => (
            <NavLink to={a.to} key={a.label} className="quick-action-card">
              <span className="quick-action-icon">{a.icon}</span>
              <span className="quick-action-label">{a.label}</span>
              <span className="quick-action-arrow">→</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Note for Sprint 2 */}
      <p className="overview-note">
        Stat counts will populate once the athlete and registration APIs are wired in Sprint 2 (CACOS-25/27).
      </p>

    </div>
  );
}
