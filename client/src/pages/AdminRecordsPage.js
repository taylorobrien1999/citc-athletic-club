import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AdminRecordsPage() {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ athleteName: '', event: '', category: '', mark: '', note: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${API_URL}/api/records`);
      const data = await res.json();
      if (res.ok) setRecords(data.records);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm({ athleteName: '', event: '', category: '', mark: '', note: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      const url = editingId ? `${API_URL}/api/records/${editingId}` : `${API_URL}/api/records`;
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to save record.'); return; }

      resetForm();
      setSuccess(editingId ? 'Record updated.' : 'Record added.');
      fetchRecords();
    } catch (err) {
      setError('Failed to save record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record) => {
    setForm({
      athleteName: record.athleteName,
      event: record.event,
      category: record.category,
      mark: record.mark,
      note: record.note || '',
    });
    setEditingId(record.id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/records/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRecords(prev => prev.filter(r => r.id !== id));
        if (editingId === id) resetForm();
      }
    } catch (err) {
      setError('Failed to delete record.');
    }
  };

  return (
    <div className="admin-cms">
      <div className="admin-cms-header">
        <h2>Club Records</h2>
        <p className="admin-cms-sub">Add, edit, or remove athlete records shown on the public Club Records page.</p>
      </div>

      {error && <p className="admin-cms-error">{error}</p>}
      {success && <p className="admin-cms-success">{success}</p>}

      <form className="admin-cms-form" onSubmit={handleSubmit}>
        <div className="admin-cms-field">
          <label>Athlete Name</label>
          <input name="athleteName" value={form.athleteName} onChange={handleChange} placeholder="e.g. Keon" required />
        </div>
        <div className="admin-cms-field">
          <label>Event</label>
          <input name="event" value={form.event} onChange={handleChange} placeholder="e.g. 60m Hurdles" required />
        </div>
        <div className="admin-cms-field">
          <label>Category</label>
          <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. U17" required />
        </div>
        <div className="admin-cms-field">
          <label>Mark</label>
          <input name="mark" value={form.mark} onChange={handleChange} placeholder="e.g. 7.77" required />
        </div>
        <div className="admin-cms-field admin-cms-form-full">
          <label>Note (optional)</label>
          <input name="note" value={form.note} onChange={handleChange} placeholder="e.g. Canadian Record" />
        </div>
        <button className="admin-cms-submit" disabled={submitting}>
          {submitting ? 'Saving...' : editingId ? 'Update Record' : 'Add Record'}
        </button>
        {editingId && (
          <button type="button" className="admin-cms-delete-btn" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : records.length === 0 ? (
        <p className="admin-cms-empty">No records added yet.</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th>Athlete</th><th>Event</th><th>Category</th><th>Mark</th><th>Note</th><th></th></tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.athleteName}</td>
                  <td>{r.event}</td>
                  <td>{r.category}</td>
                  <td>{r.mark}</td>
                  <td>{r.note || '—'}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-cms-submit" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => handleEdit(r)}>
                      Edit
                    </button>
                    <button className="admin-cms-delete-btn" onClick={() => handleDelete(r.id)}>
                      Delete
                    </button>
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
