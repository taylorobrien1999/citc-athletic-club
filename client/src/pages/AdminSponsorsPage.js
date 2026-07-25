import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUploadButton from '../components/FileUploadButton';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BLANK_FORM = { name: '', logoUrl: '', websiteUrl: '', displayOrder: 0 };

export default function AdminSponsorsPage() {
  const { token } = useAuth();
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [editingId, setEditingId] = useState(null);

  const fetchSponsors = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sponsors`);
      const data = await res.json();
      if (res.ok) setSponsors(data.sponsors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSponsors(); }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => { setForm(BLANK_FORM); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      if (!form.logoUrl) { setError('Please upload a logo image.'); return; }

      const url = editingId ? `${API_URL}/api/sponsors/${editingId}` : `${API_URL}/api/sponsors`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to save sponsor.'); return; }

      resetForm();
      setSuccess(editingId ? 'Sponsor updated.' : 'Sponsor added.');
      fetchSponsors();
    } catch (err) {
      setError('Failed to save sponsor.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (s) => {
    setForm({
      name: s.name,
      logoUrl: s.logoUrl,
      websiteUrl: s.websiteUrl || '',
      displayOrder: s.displayOrder || 0,
    });
    setEditingId(s.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/sponsors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSponsors(prev => prev.filter(s => s.id !== id));
        if (editingId === id) resetForm();
      }
    } catch (err) {
      setError('Failed to delete sponsor.');
    }
  };

  return (
    <div className="admin-cms">
      <div className="admin-cms-header">
        <h2>Sponsors</h2>
        <p className="admin-cms-sub">
          Upload sponsor logos to display in a collage near the bottom of the Homepage. The
          section is hidden entirely on the public site until at least one sponsor is added.
        </p>
      </div>

      {error && <p className="admin-cms-error">{error}</p>}
      {success && <p className="admin-cms-success">{success}</p>}

      <form className="admin-cms-form" onSubmit={handleSubmit}>
        <div className="admin-cms-field">
          <label>Sponsor Name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. MNP" required />
        </div>
        <div className="admin-cms-field">
          <label>Website URL (optional)</label>
          <input name="websiteUrl" value={form.websiteUrl} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="admin-cms-field">
          <label>Display Order</label>
          <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange} />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Logo</label>
          {form.logoUrl && <img src={form.logoUrl} alt="" style={{ height: 50, display: 'block', marginBottom: 8 }} />}
          <FileUploadButton accept="image/*" onUploaded={(url) => setForm(prev => ({ ...prev, logoUrl: url }))} />
        </div>
        <button className="admin-cms-submit" disabled={submitting}>
          {submitting ? 'Saving...' : editingId ? 'Update Sponsor' : 'Add Sponsor'}
        </button>
        {editingId && (
          <button type="button" className="admin-cms-delete-btn" onClick={resetForm}>Cancel Edit</button>
        )}
      </form>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : sponsors.length === 0 ? (
        <p className="admin-cms-empty">No sponsors added yet — the Homepage section stays hidden until at least one exists.</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th>Logo</th><th>Name</th><th>Website</th><th>Order</th><th></th></tr>
            </thead>
            <tbody>
              {sponsors.map((s) => (
                <tr key={s.id}>
                  <td><img src={s.logoUrl} alt={s.name} style={{ height: 32 }} /></td>
                  <td>{s.name}</td>
                  <td>{s.websiteUrl ? <a href={s.websiteUrl} target="_blank" rel="noreferrer">Visit</a> : '—'}</td>
                  <td>{s.displayOrder}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-cms-submit" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => handleEdit(s)}>Edit</button>
                    <button className="admin-cms-delete-btn" onClick={() => handleDelete(s.id)}>Delete</button>
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
