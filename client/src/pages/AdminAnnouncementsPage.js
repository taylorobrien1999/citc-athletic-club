import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUploadButton from '../components/FileUploadButton';
import RichTextEditor from '../components/RichTextEditor';
import { stripHtml, cleanRichText } from '../utils/htmlUtils';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BLANK_FORM = { title: '', body: '', imageUrl: '' };

export default function AdminAnnouncementsPage() {
  const { token, user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [editingId, setEditingId] = useState(null);

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

  const resetForm = () => { setForm(BLANK_FORM); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      const cleanedForm = { ...form, body: cleanRichText(form.body) };
      const url = editingId ? `${API_URL}/api/announcements/${editingId}` : `${API_URL}/api/announcements`;
      const method = editingId ? 'PATCH' : 'POST';
      const body = editingId
        ? cleanedForm
        : { ...cleanedForm, postedBy: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to save announcement.'); return; }

      resetForm();
      setSuccess(editingId ? 'Announcement updated.' : 'Announcement posted.');
      fetchAnnouncements();
    } catch (err) {
      setError('Failed to save announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (a) => {
    setForm({ title: a.title, body: a.body, imageUrl: a.imageUrl || '' });
    setEditingId(a.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
        if (editingId === id) resetForm();
      }
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
          <RichTextEditor
            value={form.body}
            onChange={(html) => setForm(prev => ({ ...prev, body: html }))}
            placeholder="Details for members..."
          />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Photo URL (optional)</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://... (or upload below)" />
          <FileUploadButton accept="image/*" onUploaded={(url) => setForm(prev => ({ ...prev, imageUrl: url }))} />
        </div>
        <button className="admin-cms-submit" disabled={submitting}>
          {submitting ? 'Saving...' : editingId ? 'Update Announcement' : 'Post Announcement'}
        </button>
        {editingId && (
          <button type="button" className="admin-cms-delete-btn" onClick={resetForm}>Cancel Edit</button>
        )}
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
                  <td>{(() => { const clean = stripHtml(a.body); return clean.length > 80 ? clean.slice(0, 80) + '...' : clean; })()}</td>
                  <td>{a.imageUrl ? <img src={a.imageUrl} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} /> : '—'}</td>
                  <td>{a.postedBy || '—'}</td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-cms-submit" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => handleEdit(a)}>Edit</button>
                    <button className="admin-cms-delete-btn" onClick={() => handleDelete(a.id)}>Delete</button>
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
