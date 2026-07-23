import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUploadButton from '../components/FileUploadButton';
import RichTextEditor from '../components/RichTextEditor';
import { stripHtml, cleanRichText } from '../utils/htmlUtils';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BLANK_FORM = { name: '', ageGroup: '', description: '', imageUrl: '' };

export default function AdminProgramsPage() {
  const { token } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [editingId, setEditingId] = useState(null);

  const fetchPrograms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/programs`);
      const data = await res.json();
      if (res.ok) setPrograms(data.programs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrograms(); }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => { setForm(BLANK_FORM); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      const cleanedForm = { ...form, description: cleanRichText(form.description) };
      const url = editingId ? `${API_URL}/api/programs/${editingId}` : `${API_URL}/api/programs`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(cleanedForm),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to save program.'); return; }

      resetForm();
      setSuccess(editingId ? 'Program updated.' : 'Program added.');
      fetchPrograms();
    } catch (err) {
      setError('Failed to save program.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, ageGroup: p.ageGroup || '', description: p.description, imageUrl: p.imageUrl || '' });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/programs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPrograms(prev => prev.filter(p => p.id !== id));
        if (editingId === id) resetForm();
      }
    } catch (err) {
      setError('Failed to delete program.');
    }
  };

  return (
    <div className="admin-cms">
      <div className="admin-cms-header">
        <h2>Programs</h2>
        <p className="admin-cms-sub">Manage the training programs shown on the public site.</p>
      </div>

      {error && <p className="admin-cms-error">{error}</p>}
      {success && <p className="admin-cms-success">{success}</p>}

      <form className="admin-cms-form" onSubmit={handleSubmit}>
        <div className="admin-cms-field">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Sprint Program" required />
        </div>
        <div className="admin-cms-field">
          <label>Age Group</label>
          <input name="ageGroup" value={form.ageGroup} onChange={handleChange} placeholder="e.g. U16+" />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Description</label>
          <RichTextEditor
            value={form.description}
            onChange={(html) => setForm(prev => ({ ...prev, description: html }))}
            placeholder="Program description..."
          />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Photo (optional)</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://... (or upload below)" />
          <FileUploadButton accept="image/*" onUploaded={(url) => setForm(prev => ({ ...prev, imageUrl: url }))} />
        </div>
        <button className="admin-cms-submit" disabled={submitting}>
          {submitting ? 'Saving...' : editingId ? 'Update Program' : 'Add Program'}
        </button>
        {editingId && (
          <button type="button" className="admin-cms-delete-btn" onClick={resetForm}>Cancel Edit</button>
        )}
      </form>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : programs.length === 0 ? (
        <p className="admin-cms-empty">No programs added yet.</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th>Photo</th><th>Name</th><th>Age Group</th><th>Description</th><th></th></tr>
            </thead>
            <tbody>
              {programs.map((p) => (
                <tr key={p.id}>
                  <td>{p.imageUrl ? <img src={p.imageUrl} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} /> : '—'}</td>
                  <td>{p.name}</td>
                  <td>{p.ageGroup || '—'}</td>
                  <td>{(() => { const clean = stripHtml(p.description); return clean.length > 80 ? clean.slice(0, 80) + '...' : clean; })()}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-cms-submit" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => handleEdit(p)}>Edit</button>
                    <button className="admin-cms-delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
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
