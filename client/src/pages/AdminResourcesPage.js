import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUploadButton from '../components/FileUploadButton';
import RichTextEditor from '../components/RichTextEditor';
import { stripHtml, cleanRichText } from '../utils/htmlUtils';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BLANK_FORM = { title: '', type: 'link', url: '', description: '', visibility: 'public' };

export default function AdminResourcesPage() {
  const { token } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [editingId, setEditingId] = useState(null);

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

  const resetForm = () => { setForm(BLANK_FORM); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      const cleanedForm = { ...form, description: cleanRichText(form.description) };
      const url = editingId ? `${API_URL}/api/resources/${editingId}` : `${API_URL}/api/resources`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(cleanedForm),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to save resource.'); return; }

      resetForm();
      setSuccess(editingId ? 'Resource updated.' : 'Resource added.');
      fetchResources();
    } catch (err) {
      setError('Failed to save resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (r) => {
    setForm({
      title: r.title,
      type: r.type,
      url: r.url,
      description: r.description || '',
      visibility: r.visibility || 'public',
    });
    setEditingId(r.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/resources/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setResources(prev => prev.filter(r => r.id !== id));
        if (editingId === id) resetForm();
      }
    } catch (err) {
      setError('Failed to delete resource.');
    }
  };

  return (
    <div className="admin-cms">
      <div className="admin-cms-header">
        <h2>Resources</h2>
        <p className="admin-cms-sub">
          Add photos, PDFs, or links — paste a URL, or upload a file directly below. Choose
          <strong> Public Website</strong> to show it on the public site (Photos/News page), or
          <strong> Members Only</strong> to show it exclusively in the Member Dashboard — each
          resource appears in one place, not both.
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
          <label>Visibility</label>
          <select name="visibility" value={form.visibility} onChange={handleChange}>
            <option value="public">Public Website</option>
            <option value="members">Members Only (Dashboard)</option>
          </select>
        </div>
        <div className="admin-cms-field">
          <label>URL</label>
          <input name="url" value={form.url} onChange={handleChange} placeholder="https://... (or upload below)" />
          <FileUploadButton onUploaded={(url) => setForm(prev => ({ ...prev, url }))} />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Description</label>
          <RichTextEditor
            value={form.description}
            onChange={(html) => setForm(prev => ({ ...prev, description: html }))}
            placeholder="Optional description..."
          />
        </div>
        <button className="admin-cms-submit" disabled={submitting}>
          {submitting ? 'Saving...' : editingId ? 'Update Resource' : 'Add Resource'}
        </button>
        {editingId && (
          <button type="button" className="admin-cms-delete-btn" onClick={resetForm}>Cancel Edit</button>
        )}
      </form>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : resources.length === 0 ? (
        <p className="admin-cms-empty">No resources added yet.</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th>Title</th><th>Type</th><th>Visibility</th><th>Link</th><th>Description</th><th></th></tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.type}</td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: r.visibility === 'members' ? '#fef3c7' : '#f3eafd',
                      color: r.visibility === 'members' ? '#92400e' : '#6c3baa',
                    }}>
                      {r.visibility === 'members' ? 'Members Only' : 'Public'}
                    </span>
                  </td>
                  <td><a href={r.url} target="_blank" rel="noreferrer">Open</a></td>
                  <td>{(() => { const clean = stripHtml(r.description); return clean.length > 60 ? clean.slice(0, 60) + '...' : (clean || '—'); })()}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-cms-submit" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => handleEdit(r)}>Edit</button>
                    <button className="admin-cms-delete-btn" onClick={() => handleDelete(r.id)}>Delete</button>
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
