import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import { stripHtml, cleanRichText } from '../utils/htmlUtils';
import { parseLocalDate } from '../utils/dateUtils';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BLANK_FORM = { title: '', eventDate: '', startTime: '', location: '', notes: '', visibility: 'public' };

export default function AdminEventsPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [editingId, setEditingId] = useState(null);

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

  const resetForm = () => { setForm(BLANK_FORM); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      const cleanedForm = { ...form, notes: cleanRichText(form.notes) };
      const url = editingId ? `${API_URL}/api/events/${editingId}` : `${API_URL}/api/events`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(cleanedForm),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to save event.'); return; }

      resetForm();
      setSuccess(editingId ? 'Event updated.' : 'Event added.');
      fetchEvents();
    } catch (err) {
      setError('Failed to save event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ev) => {
    setForm({
      title: ev.title,
      eventDate: ev.eventDate,
      startTime: ev.startTime || '',
      location: ev.location || '',
      notes: ev.notes || '',
      visibility: ev.visibility || 'public',
    });
    setEditingId(ev.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setEvents(prev => prev.filter(ev => ev.id !== id));
        if (editingId === id) resetForm();
      }
    } catch (err) {
      setError('Failed to delete event.');
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
        <div className="admin-cms-field">
          <label>Visibility</label>
          <select name="visibility" value={form.visibility} onChange={handleChange}>
            <option value="public">Public Website</option>
            <option value="members">Members Only (Dashboard)</option>
          </select>
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Notes</label>
          <RichTextEditor
            value={form.notes}
            onChange={(html) => setForm(prev => ({ ...prev, notes: html }))}
            placeholder="Optional details..."
          />
        </div>
        <button className="admin-cms-submit" disabled={submitting}>
          {submitting ? 'Saving...' : editingId ? 'Update Event' : 'Add Event'}
        </button>
        {editingId && (
          <button type="button" className="admin-cms-delete-btn" onClick={resetForm}>Cancel Edit</button>
        )}
      </form>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : events.length === 0 ? (
        <p className="admin-cms-empty">No events scheduled yet.</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th>Title</th><th>Date</th><th>Time</th><th>Location</th><th>Visibility</th><th>Notes</th><th></th></tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.title}</td>
                  <td>{parseLocalDate(ev.eventDate).toLocaleDateString()}</td>
                  <td>{ev.startTime || '—'}</td>
                  <td>{ev.location || '—'}</td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: ev.visibility === 'members' ? '#fef3c7' : '#f3eafd',
                      color: ev.visibility === 'members' ? '#92400e' : '#6c3baa',
                    }}>
                      {ev.visibility === 'members' ? 'Members Only' : 'Public'}
                    </span>
                  </td>
                  <td>{(() => { const clean = stripHtml(ev.notes); return clean.length > 60 ? clean.slice(0, 60) + '...' : (clean || '—'); })()}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-cms-submit" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => handleEdit(ev)}>Edit</button>
                    <button className="admin-cms-delete-btn" onClick={() => handleDelete(ev.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
