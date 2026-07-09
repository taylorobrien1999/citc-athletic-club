import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminInquiriesPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const STATUS_OPTIONS = ['pending', 'contacted', 'accepted', 'declined'];

export default function AdminInquiriesPage() {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/inquiries/${id}`, {
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
        prev.map(inq => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
    } catch (err) {
      setError('Failed to update status.');
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

      {inquiries.length === 0 ? (
        <p className="inquiries-empty">No inquiries yet.</p>
      ) : (
        <div className="inquiries-table-wrap">
          <table className="inquiries-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Received</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id}>
                  <td>{inq.firstName} {inq.lastName}</td>
                  <td><a href={`mailto:${inq.email}`}>{inq.email}</a></td>
                  <td>{inq.phone || '—'}</td>
                  <td className="inquiries-message-cell">{inq.message || '—'}</td>
                  <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      className={`inquiries-status inquiries-status-${inq.status}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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
