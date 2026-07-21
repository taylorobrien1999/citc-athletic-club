import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminInquiriesPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const STATUS_OPTIONS = ['pending', 'accepted', 'declined'];

export default function AdminInquiriesPage() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [pendingStatus, setPendingStatus] = useState({}); // { [id]: draftStatus }
  const [savingId, setSavingId] = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  const fetchInquiries = async () => {
    try {
      const res = await fetch(`${API_URL}/api/inquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to load inquiries.');
        return;
      }
      setInquiries(data.inquiries);
    } catch (err) {
      setError('Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDraftChange = (id, newStatus) => {
    setPendingStatus(prev => ({ ...prev, [id]: newStatus }));
  };

  const handleSave = async (inq) => {
    const newStatus = pendingStatus[inq.id] ?? inq.status;
    if (newStatus === inq.status) return; // nothing changed, don't call the server

    setError(''); setSuccess(''); setSavingId(inq.id);
    try {
      const res = await fetch(`${API_URL}/api/inquiries/${inq.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        setError('Failed to update status.');
        return;
      }

      setInquiries(prev =>
        prev.map(i => (i.id === inq.id ? { ...i, status: newStatus } : i))
      );
      setSuccess(
        newStatus === 'accepted'
          ? `${inq.firstName} accepted — invite email sent (if this is the first time).`
          : 'Status updated.'
      );
    } catch (err) {
      setError('Failed to update status.');
    } finally {
      setSavingId('');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      setError('Failed to delete inquiry.');
    }
  };

  if (loading) return <p className="inquiries-loading">Loading inquiries...</p>;

  return (
    <div className="admin-inquiries">
      <div className="inquiries-header">
        <h2>Registration Inquiries</h2>
        <p className="inquiries-sub">
          Guests who've expressed interest in joining CITC through the website.
        </p>
      </div>

      {error && <p className="inquiries-error">{error}</p>}
      {success && <p className="inquiries-success">{success}</p>}

      {inquiries.length === 0 ? (
        <p className="inquiries-empty">No inquiries yet.</p>
      ) : (
        <div className="inquiries-table-wrap">
          <table className="inquiries-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Received</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => {
                const draft = pendingStatus[inq.id] ?? inq.status;
                const isDirty = draft !== inq.status;

                return (
                  <tr key={inq.id}>
                    <td>{inq.firstName} {inq.lastName}</td>
                    <td>{inq.dateOfBirth ? new Date(inq.dateOfBirth).toLocaleDateString(undefined, { timeZone: 'UTC' }) : '—'}</td>
                    <td><a href={`mailto:${inq.email}`}>{inq.email}</a></td>
                    <td>{inq.phone || '—'}</td>
                    <td className="inquiries-message-cell">{inq.message || '—'}</td>
                    <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        value={draft}
                        onChange={(e) => handleDraftChange(inq.id, e.target.value)}
                        className={`inquiries-status inquiries-status-${draft}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {isDirty && (
                        <button
                          className="inquiries-save-btn"
                          onClick={() => handleSave(inq)}
                          disabled={savingId === inq.id}
                        >
                          {savingId === inq.id ? 'Saving...' : 'Save'}
                        </button>
                      )}
                    </td>
                    <td>
                      <button className="inquiries-delete-btn" onClick={() => handleDelete(inq.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
