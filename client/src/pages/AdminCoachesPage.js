import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUploadButton from '../components/FileUploadButton';
import RichTextEditor from '../components/RichTextEditor';
import { cleanRichText } from '../utils/htmlUtils';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BLANK_FORM = {
  name: '', role: '', photoUrl: '', homepageSummary: '', fullBio: '', qualifications: '', displayOrder: 0,
};

export default function AdminCoachesPage() {
  const { token } = useAuth();
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [editingId, setEditingId] = useState(null);

  const fetchCoaches = async () => {
    try {
      const res = await fetch(`${API_URL}/api/team-coaches`);
      const data = await res.json();
      if (res.ok) setCoaches(data.coaches);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoaches(); }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => { setForm(BLANK_FORM); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      const cleanedForm = {
        ...form,
        homepageSummary: cleanRichText(form.homepageSummary),
        fullBio: cleanRichText(form.fullBio),
      };
      const url = editingId ? `${API_URL}/api/team-coaches/${editingId}` : `${API_URL}/api/team-coaches`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(cleanedForm),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to save coach.'); return; }

      resetForm();
      setSuccess(editingId ? 'Coach updated.' : 'Coach added.');
      fetchCoaches();
    } catch (err) {
      setError('Failed to save coach.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (coach) => {
    setForm({
      name: coach.name || '',
      role: coach.role || '',
      photoUrl: coach.photoUrl || '',
      homepageSummary: coach.homepageSummary || '',
      fullBio: coach.fullBio || '',
      qualifications: coach.qualifications || '',
      displayOrder: coach.displayOrder || 0,
    });
    setEditingId(coach.id);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Remove this coach from the site? This cannot be undone.');
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_URL}/api/team-coaches/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCoaches(prev => prev.filter(c => c.id !== id));
        if (editingId === id) resetForm();
      }
    } catch (err) {
      setError('Failed to delete coach.');
    }
  };

  return (
    <div className="admin-cms">
      <div className="admin-cms-header">
        <h2>Coaches</h2>
        <p className="admin-cms-sub">
          Add, edit, or remove coaches shown on the public site. The Homepage Summary is a
          short teaser shown on the homepage; the Full Bio and Qualifications appear on the
          full Coaches page — each can be written independently.
        </p>
      </div>

      {error && <p className="admin-cms-error">{error}</p>}
      {success && <p className="admin-cms-success">{success}</p>}

      <form className="admin-cms-form" onSubmit={handleSubmit}>
        <div className="admin-cms-field">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Tessa Gray-Burnett" required />
        </div>
        <div className="admin-cms-field">
          <label>Role / Title</label>
          <input name="role" value={form.role} onChange={handleChange} placeholder="e.g. Head Coach" />
        </div>
        <div className="admin-cms-field">
          <label>Display Order</label>
          <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange} placeholder="0" />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Photo</label>
          <input name="photoUrl" value={form.photoUrl} onChange={handleChange} placeholder="https://... (or upload below)" />
          <FileUploadButton accept="image/*" onUploaded={(url) => setForm(prev => ({ ...prev, photoUrl: url }))} />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Homepage Summary (short teaser — separate from the full bio)</label>
          <RichTextEditor
            value={form.homepageSummary}
            onChange={(html) => setForm(prev => ({ ...prev, homepageSummary: html }))}
            placeholder="One or two sentences for the homepage card..."
          />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Full Bio (shown on the Coaches page)</label>
          <RichTextEditor
            value={form.fullBio}
            onChange={(html) => setForm(prev => ({ ...prev, fullBio: html }))}
            placeholder="Full biography..."
          />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Qualifications (one per line)</label>
          <textarea name="qualifications" value={form.qualifications} onChange={handleChange} placeholder={'Bachelor of Kinesiology...\nCSCS Certified...'} rows={4} />
        </div>
        <button className="admin-cms-submit" disabled={submitting}>
          {submitting ? 'Saving...' : editingId ? 'Update Coach' : 'Add Coach'}
        </button>
        {editingId && (
          <button type="button" className="admin-cms-delete-btn" onClick={resetForm}>Cancel Edit</button>
        )}
      </form>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : coaches.length === 0 ? (
        <p className="admin-cms-empty">No coaches added yet.</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th>Photo</th><th>Name</th><th>Role</th><th>Order</th><th></th></tr>
            </thead>
            <tbody>
              {coaches.map((c) => (
                <tr key={c.id}>
                  <td>{c.photoUrl ? <img src={c.photoUrl} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} /> : '—'}</td>
                  <td>{c.name}</td>
                  <td>{c.role || '—'}</td>
                  <td>{c.displayOrder}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-cms-submit" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => handleEdit(c)}>Edit</button>
                    <button className="admin-cms-delete-btn" onClick={() => handleDelete(c.id)}>Delete</button>
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
