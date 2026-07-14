import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AdminEventsPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', eventDate: '', startTime: '', location: '', notes: '' });

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events`);
      const data = await res.json();
      if (res.ok) setEvents(data.events);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to add event.'); return; }
      setForm({ title: '', eventDate: '', startTime: '', location: '', notes: '' });
      setSuccess('Event added.');
      fetchEvents();
    } catch (err) {
      setError('Failed to add event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-cms">
      <div className="admin-cms-header">
        <h2>Events</h2>
        <p className="admin-cms-sub">Manage practices, meets, and other scheduled events.</p>
      </div>

      {error && <p className="admin-cms-error">{error}</p>}
      {success && <p className="admin-cms-success">{success}</p>}

      <form className="admin-cms-form" onSubmit={handleSubmit}>
        <div className="admin-cms-field">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Practice" required />
        </div>
        <div className="admin-cms-field">
          <label>Date</label>
          <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required />
        </div>
        <div className="admin-cms-field">
          <label>Start Time</label>
          <input name="startTime" value={form.startTime} onChange={handleChange} placeholder="5:00 PM" />
        </div>
        <div className="admin-cms-field">
          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} placeholder="Glenmore Track" />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Optional details..." />
        </div>
        <button className="admin-cms-submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Event'}
        </button>
      </form>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : events.length === 0 ? (
        <p className="admin-cms-empty">No events scheduled yet.</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th>Title</th><th>Date</th><th>Time</th><th>Location</th><th>Notes</th></tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.title}</td>
                  <td>{new Date(ev.eventDate).toLocaleDateString()}</td>
                  <td>{ev.startTime || '—'}</td>
                  <td>{ev.location || '—'}</td>
                  <td>{ev.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}