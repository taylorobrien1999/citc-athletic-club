import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminCMS.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AdminMembersPage() {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to load members.'); return; }
      setMembers(data.members);
    } catch (err) {
      setError('Failed to load members.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${API_URL}/api/members/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setAdmins(data.admins);
    } catch (err) {
      // non-critical section, fail quietly
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDemote = async (admin) => {
    const confirmed = window.confirm(
      `Remove admin access from ${admin.firstName} ${admin.lastName}? They'll become a regular member.`
    );
    if (!confirmed) return;

    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_URL}/api/members/${admin.id}/demote`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to demote admin.'); return; }

      setAdmins(prev => prev.filter(a => a.id !== admin.id));
      setSuccess(`${admin.firstName} is no longer an admin.`);
    } catch (err) {
      setError('Failed to demote admin.');
    }
  };

  const handleToggleActive = async (member) => {
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_URL}/api/members/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !member.isActive }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to update member.'); return; }

      setMembers(prev => prev.map(m => (m.id === member.id ? { ...m, isActive: !member.isActive } : m)));
      setSuccess(
        member.isActive
          ? `${member.firstName} has been deactivated and can no longer log in.`
          : `${member.firstName} has been reactivated.`
      );
    } catch (err) {
      setError('Failed to update member.');
    }
  };

  const handlePromote = async (member) => {
    const confirmed = window.confirm(
      `Give ${member.firstName} ${member.lastName} full admin access? They'll be able to manage all site content, members, and settings.`
    );
    if (!confirmed) return;

    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_URL}/api/members/${member.id}/promote`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to promote member.'); return; }

      // Promoted members are no longer role:'member', so they drop off this list.
      setMembers(prev => prev.filter(m => m.id !== member.id));
      setSuccess(`${member.firstName} is now an admin.`);
    } catch (err) {
      setError('Failed to promote member.');
    }
  };

  const handleDelete = async (member) => {
    const confirmed = window.confirm(
      `Permanently delete ${member.firstName} ${member.lastName}'s account? This cannot be undone. Consider deactivating instead if you just want to block their access.`
    );
    if (!confirmed) return;

    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_URL}/api/members/${member.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMembers(prev => prev.filter(m => m.id !== member.id));
        setSuccess(`${member.firstName}'s account was permanently deleted.`);
      }
    } catch (err) {
      setError('Failed to delete member.');
    }
  };

  return (
    <div className="admin-cms">
      <div className="admin-cms-header">
        <h2>Manage Members</h2>
        <p className="admin-cms-sub">
          Deactivate an account to block login without losing their data, or permanently delete it.
        </p>
      </div>

      {error && <p className="admin-cms-error">{error}</p>}
      {success && <p className="admin-cms-success">{success}</p>}

      {admins.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>Current Admins</h3>
          <div className="admin-cms-table-wrap">
            <table className="admin-cms-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th></th></tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id}>
                    <td>{a.firstName} {a.lastName}</td>
                    <td>{a.email}</td>
                    <td>
                      {a.isSuperAdmin ? (
                        <span style={{ color: '#6c3baa', fontWeight: 600, fontSize: '0.8rem' }}>
                          Protected
                        </span>
                      ) : (
                        <button className="admin-cms-delete-btn" onClick={() => handleDemote(a)}>
                          Demote to Member
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : members.length === 0 ? (
        <p className="admin-cms-empty">No member accounts yet.</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Joined</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>{m.firstName} {m.lastName}</td>
                  <td>{m.email}</td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span style={{
                      color: m.isActive ? '#15803d' : '#b91c1c',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                    }}>
                      {m.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="admin-cms-delete-btn"
                      style={{ borderColor: '#c4b5fd', color: '#6c3baa' }}
                      onClick={() => handlePromote(m)}
                    >
                      Promote to Admin
                    </button>
                    <button
                      className="admin-cms-delete-btn"
                      style={m.isActive ? {} : { borderColor: '#86efac', color: '#15803d' }}
                      onClick={() => handleToggleActive(m)}
                    >
                      {m.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                    <button className="admin-cms-delete-btn" onClick={() => handleDelete(m)}>
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
