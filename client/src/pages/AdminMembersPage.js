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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState(null);

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

  const displayedMembers = members
    .filter((m) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      if (sortBy === 'az') return nameA.localeCompare(nameB);
      if (sortBy === 'za') return nameB.localeCompare(nameA);
      return 0;
    });

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
                        <span className="protected-badge" style={{ color: '#6c3baa', fontWeight: 600, fontSize: '0.8rem' }}>
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

      <div className="members-toolbar">
        <input
          type="text"
          className="members-search"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="members-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Join Date (Newest)</option>
          <option value="oldest">Join Date (Oldest)</option>
          <option value="az">Name (A–Z)</option>
          <option value="za">Name (Z–A)</option>
        </select>
      </div>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : displayedMembers.length === 0 ? (
        <p className="admin-cms-empty">{members.length === 0 ? 'No member accounts yet.' : 'No members match your search.'}</p>
      ) : (
        <div className="admin-cms-table-wrap">
          <table className="admin-cms-table">
            <thead>
              <tr><th></th><th>Name</th><th>Email</th><th>Joined</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {displayedMembers.map((m) => {
                const isExpanded = expandedId === m.id;
                const hasExtraInfo = m.phone || m.emergencyContactName || m.emergencyContactPhone;
                return (
                <>
                <tr key={m.id}>
                  <td>
                    {m.profilePictureUrl ? (
                      <img src={m.profilePictureUrl} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div className="member-avatar-fallback" style={{
                        width: 36, height: 36, borderRadius: '50%', background: '#f3eafd', color: '#6c3baa',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13,
                      }}>
                        {m.firstName?.[0]}{m.lastName?.[0]}
                      </div>
                    )}
                  </td>
                  <td>
                    {m.firstName} {m.lastName}
                    {hasExtraInfo && (
                      <button
                        className="more-toggle-btn"
                        onClick={() => setExpandedId(isExpanded ? null : m.id)}
                        style={{ background: 'none', border: 'none', color: '#6c3baa', fontSize: 11, marginLeft: 8, cursor: 'pointer', fontWeight: 700 }}
                      >
                        {isExpanded ? '▲ Less' : '▼ More'}
                      </button>
                    )}
                  </td>
                  <td>{m.email}</td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className="status-badge" style={{
                      color: m.isActive ? '#15803d' : '#b91c1c',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                    }}>
                      {m.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="admin-cms-delete-btn promote-btn"
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
                {isExpanded && (
                  <tr key={`${m.id}-expanded`}>
                    <td colSpan={6} className="expanded-details-row" style={{ background: '#f9f8fc', padding: '12px 16px', fontSize: 13 }}>
                      {m.phone && <div><strong>Phone:</strong> {m.phone}</div>}
                      {m.dateOfBirth && <div><strong>Date of Birth:</strong> {new Date(m.dateOfBirth).toLocaleDateString(undefined, { timeZone: 'UTC' })}</div>}
                      {m.emergencyContactName && (
                        <div>
                          <strong>Emergency Contact:</strong> {m.emergencyContactName}
                          {m.emergencyContactRelation && ` (${m.emergencyContactRelation})`}
                        </div>
                      )}
                      {m.emergencyContactPhone && <div><strong>Emergency Phone:</strong> {m.emergencyContactPhone}</div>}
                    </td>
                  </tr>
                )}
                </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
