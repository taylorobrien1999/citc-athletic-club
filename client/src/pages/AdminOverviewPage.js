import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import './AdminOverviewPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AdminOverviewPage() {
  const { user, token } = useAuth();

  const [counts, setCounts] = useState({ programs: null, events: null, announcements: null, inquiries: null, members: null });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pendingInquiries, setPendingInquiries] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [programsRes, eventsRes, announcementsRes, inquiriesRes, membersRes] = await Promise.all([
          fetch(`${API_URL}/api/programs`),
          fetch(`${API_URL}/api/events`),
          fetch(`${API_URL}/api/announcements`),
          fetch(`${API_URL}/api/inquiries`, { headers }),
          fetch(`${API_URL}/api/members`, { headers }),
        ]);

        const [programsData, eventsData, announcementsData, inquiriesData, membersData] = await Promise.all([
          programsRes.json(), eventsRes.json(), announcementsRes.json(), inquiriesRes.json(), membersRes.json(),
        ]);

        const programs = programsData.programs || [];
        const events = eventsData.events || [];
        const announcements = announcementsData.announcements || [];
        const inquiries = inquiriesData.inquiries || [];
        const members = membersData.members || [];

        setCounts({
          programs: programs.length,
          events: events.length,
          announcements: announcements.length,
          inquiries: inquiries.length,
          members: members.length,
        });

        setRecentAnnouncements(announcements.slice(0, 3));

        const today = new Date(); today.setHours(0, 0, 0, 0);
        const upcoming = events
          .filter(ev => new Date(ev.eventDate) >= today)
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
          .slice(0, 3);
        setUpcomingEvents(upcoming);

        setPendingInquiries(inquiries.filter(i => i.status === 'pending').length);
      } catch (err) {
        // Quiet fail — stat cards just show blanks rather than breaking the page
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const STATS = [
    { label: 'Members',       value: counts.members,       icon: '👥', to: '/admin/members' },
    { label: 'Programs',      value: counts.programs,      icon: '📋', to: '/admin/programs' },
    { label: 'Events',        value: counts.events,        icon: '📅', to: '/admin/events' },
    { label: 'Announcements', value: counts.announcements, icon: '📢', to: '/admin/announcements' },
  ];

  return (
    <div className="overview">

      <div className="overview-welcome">
        <h2 className="overview-heading">
          Welcome back, {user?.firstName || 'Admin'}.
        </h2>
        <p className="overview-sub">
          Here's a snapshot of the Calgary International Track Club system.
        </p>
      </div>

      {pendingInquiries > 0 && (
        <NavLink to="/admin/inquiries" className="overview-alert">
          <strong>{pendingInquiries}</strong> registration {pendingInquiries === 1 ? 'inquiry needs' : 'inquiries need'} your review →
        </NavLink>
      )}

      <div className="overview-stats">
        {STATS.map((s) => (
          <NavLink to={s.to} key={s.label} className="stat-card">
            <span className="stat-icon">{s.icon}</span>
            <div>
              <div className="stat-value">{loading ? '···' : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </NavLink>
        ))}
      </div>

      <div className="overview-columns">
        <div className="overview-section">
          <div className="overview-section-header">
            <h3 className="overview-section-title">Recent Announcements</h3>
            <NavLink to="/admin/announcements" className="overview-section-link">View all →</NavLink>
          </div>
          {loading ? (
            <p className="overview-empty">Loading...</p>
          ) : recentAnnouncements.length === 0 ? (
            <p className="overview-empty">No announcements posted yet.</p>
          ) : (
            <div className="overview-feed">
              {recentAnnouncements.map((a) => (
                <div className="overview-feed-item" key={a.id}>
                  <div className="overview-feed-title">{a.title}</div>
                  <div className="overview-feed-meta">{new Date(a.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overview-section">
          <div className="overview-section-header">
            <h3 className="overview-section-title">Upcoming Events</h3>
            <NavLink to="/admin/events" className="overview-section-link">View all →</NavLink>
          </div>
          {loading ? (
            <p className="overview-empty">Loading...</p>
          ) : upcomingEvents.length === 0 ? (
            <p className="overview-empty">No upcoming events scheduled.</p>
          ) : (
            <div className="overview-feed">
              {upcomingEvents.map((ev) => (
                <div className="overview-feed-item" key={ev.id}>
                  <div className="overview-feed-title">{ev.title}</div>
                  <div className="overview-feed-meta">
                    {new Date(ev.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    {ev.location && ` · ${ev.location}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
