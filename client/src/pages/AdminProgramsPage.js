import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AdminProgramsPage() {
  const { token } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', ageGroup: '', description: '' });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to add program.'); return; }
      setForm({ name: '', ageGroup: '', description: '' });
      setSuccess('Program added.');
      fetchPrograms();
    } catch (err) {
      setError('Failed to add program.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/programs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setPrograms(prev => prev.filter(p => p.id !== id));
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
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Program description..." required />
        </div>
        <button className="admin-cms-submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Program'}
        </button>
      </form>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : programs.length === 0 ? (
        <p className="admin-cms-empty">No programs added yet.</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th>Name</th><th>Age Group</th><th>Description</th><th></th></tr>
            </thead>
            <tbody>
              {programs.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.ageGroup || '—'}</td>
                  <td>{p.description}</td>
                  <td><button className="admin-cms-delete-btn" onClick={() => handleDelete(p.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}