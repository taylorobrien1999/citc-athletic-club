import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AdminFeedbackPage() {
  const { token } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`${API_URL}/api/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to load feedback.'); return; }
      setFeedback(data.feedback);
    } catch (err) {
      setError('Failed to load feedback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedback(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setFeedback(prev => prev.map(f => (f.id === id ? { ...f, status } : f)));
      }
    } catch (err) {
      setError('Failed to update feedback.');
    }
  };

  return (
    <div className="admin-cms">
      <div className="admin-cms-header">
        <h2>Feedback</h2>
        <p className="admin-cms-sub">Feedback and ratings submitted by members about events or programs.</p>
      </div>

      {error && <p className="admin-cms-error">{error}</p>}

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : feedback.length === 0 ? (
        <p className="admin-cms-empty">No feedback submitted yet.</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th>Subject</th><th>Rating</th><th>Comment</th><th>From</th><th>Status</th></tr>
            </thead>
            <tbody>
              {feedback.map((f) => (
                <tr key={f.id}>
                  <td>{f.subject || '—'}</td>
                  <td>{f.rating ? `${f.rating} / 5` : '—'}</td>
                  <td>{f.comment}</td>
                  <td>{f.submittedBy || 'Anonymous'}</td>
                  <td>
                    <select
                      className="admin-cms-status"
                      value={f.status}
                      onChange={(e) => handleStatusChange(f.id, e.target.value)}
                    >
                      <option value="new">new</option>
                      <option value="reviewed">reviewed</option>
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