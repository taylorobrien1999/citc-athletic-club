import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function DashboardPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [annRes, evRes] = await Promise.all([
          fetch(`${API_URL}/api/announcements`),
          fetch(`${API_URL}/api/events`),
        ]);
        const annData = await annRes.json();
        const evData  = await evRes.json();

        if (!annRes.ok || !evRes.ok) {
          setError('Failed to load dashboard data.');
          return;
        }

        setAnnouncements(annData.announcements);
        setEvents(evData.events);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const today = new Date();
  const upcomingEvents = events.filter(ev => new Date(ev.eventDate) >= today.setHours(0, 0, 0, 0));

  return (
    <div className="dash-page">
      <div className="dash-hero">
        <span className="dash-eyebrow">MEMBER PORTAL</span>
        <h1 className="dash-title">Welcome, {user?.firstName || 'Athlete'}.</h1>
        <p className="dash-subtitle">Here's what's happening with CITC.</p>
      </div>

      {error && <p className="dash-error">{error}</p>}

      <div className="dash-grid">
        {/* ── ANNOUNCEMENTS ── */}
        <div className="dash-card">
          <h2>Announcements</h2>
          {loading ? (
            <p className="dash-empty">Loading...</p>
          ) : announcements.length === 0 ? (
            <p className="dash-empty">No announcements yet. Check back soon.</p>
          ) : (
            <div className="dash-announcement-list">
              {announcements.map((a) => (
                <div className="dash-announcement" key={a.id}>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                  <span className="dash-meta">
                    {a.postedBy ? `${a.postedBy} · ` : ''}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SCHEDULE ── */}
        <div className="dash-card">
          <h2>Upcoming Schedule</h2>
          {loading ? (
            <p className="dash-empty">Loading...</p>
          ) : upcomingEvents.length === 0 ? (
            <p className="dash-empty">No upcoming events scheduled yet.</p>
          ) : (
            <div className="dash-event-list">
              {upcomingEvents.map((ev) => (
                <div className="dash-event" key={ev.id}>
                  <div className="dash-event-date">
                    {new Date(ev.eventDate).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric',
                    })}
                  </div>
                  <div className="dash-event-details">
                    <h3>{ev.title}</h3>
                    {ev.location && <p className="dash-meta">{ev.location}</p>}
                    {ev.startTime && <p className="dash-meta">{ev.startTime}</p>}
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
