import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AdminResourcesPage() {
  const { token } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'link', url: '', description: '' });

  const fetchResources = async () => {
    try {
      const res = await fetch(`${API_URL}/api/resources`);
      const data = await res.json();
      if (res.ok) setResources(data.resources);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to add resource.'); return; }
      setForm({ title: '', type: 'link', url: '', description: '' });
      setSuccess('Resource added.');
      fetchResources();
    } catch (err) {
      setError('Failed to add resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/resources/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setResources(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError('Failed to delete resource.');
    }
  };

  return (
    <div className="admin-cms">
      <div className="admin-cms-header">
        <h2>Resources</h2>
        <p className="admin-cms-sub">
          Add links to photos, PDFs, or other files. (Upload the file to a hosting service like
          Google Drive first, then paste the shareable link here.)
        </p>
      </div>

      {error && <p className="admin-cms-error">{error}</p>}
      {success && <p className="admin-cms-success">{success}</p>}

      <form className="admin-cms-form" onSubmit={handleSubmit}>
        <div className="admin-cms-field">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. 2026 Team Photo" required />
        </div>
        <div className="admin-cms-field">
          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="link">Link</option>
            <option value="photo">Photo</option>
            <option value="pdf">PDF</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="admin-cms-field">
          <label>URL</label>
          <input name="url" value={form.url} onChange={handleChange} placeholder="https://..." required />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Optional description..." />
        </div>
        <button className="admin-cms-submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Resource'}
        </button>
      </form>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : resources.length === 0 ? (
        <p className="admin-cms-empty">No resources added yet.</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th>Title</th><th>Type</th><th>Link</th><th>Description</th><th></th></tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.type}</td>
                  <td><a href={r.url} target="_blank" rel="noreferrer">Open</a></td>
                  <td>{r.description || '—'}</td>
                  <td><button className="admin-cms-delete-btn" onClick={() => handleDelete(r.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}