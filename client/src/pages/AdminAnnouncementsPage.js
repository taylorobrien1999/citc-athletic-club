import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AdminAnnouncementsPage() {
  const { token, user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', imageUrl: '' });

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_URL}/api/announcements`);
      const data = await res.json();
      if (res.ok) setAnnouncements(data.announcements);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, postedBy: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to post announcement.'); return; }
      setForm({ title: '', body: '', imageUrl: '' });
      setSuccess('Announcement posted.');
      fetchAnnouncements();
    } catch (err) {
      setError('Failed to post announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError('Failed to delete announcement.');
    }
  };

  return (
    <div className="admin-cms">
      <div className="admin-cms-header">
        <h2>Announcements</h2>
        <p className="admin-cms-sub">Post updates that members see on their dashboard.</p>
      </div>

      {error && <p className="admin-cms-error">{error}</p>}
      {success && <p className="admin-cms-success">{success}</p>}

      <form className="admin-cms-form" onSubmit={handleSubmit}>
        <div className="admin-cms-field">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Practice Cancelled" required />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Message</label>
          <textarea name="body" value={form.body} onChange={handleChange} placeholder="Details for members..." required />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Photo URL (optional)</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
        </div>
        <button className="admin-cms-submit" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Announcement'}
        </button>
      </form>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : announcements.length === 0 ? (
        <p className="admin-cms-empty">No announcements yet.</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th>Title</th><th>Message</th><th>Photo</th><th>Posted By</th><th>Date</th><th></th></tr>
            </thead>
            <tbody>
              {announcements.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.body}</td>
                  <td>{a.imageUrl ? <img src={a.imageUrl} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} /> : '—'}</td>
                  <td>{a.postedBy || '—'}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td><button className="admin-cms-delete-btn" onClick={() => handleDelete(a.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
