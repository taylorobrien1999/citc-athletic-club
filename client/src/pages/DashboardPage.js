import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FileUploadButton from '../components/FileUploadButton';
import './DashboardPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function DashboardPage() {
  const { user, token, updateUser } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    emergencyContactName: user?.emergencyContactName || '',
    emergencyContactRelation: user?.emergencyContactRelation || '',
    emergencyContactPhone: user?.emergencyContactPhone || '',
    profilePictureUrl: user?.profilePictureUrl || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [annRes, evRes, resRes] = await Promise.all([
          fetch(`${API_URL}/api/announcements`),
          fetch(`${API_URL}/api/events`),
          fetch(`${API_URL}/api/resources`),
        ]);
        const annData = await annRes.json();
        const evData = await evRes.json();
        const resData = await resRes.json();

        if (!annRes.ok || !evRes.ok || !resRes.ok) {
          setError('Failed to load dashboard data.');
          return;
        }

        setAnnouncements(annData.announcements);
        setEvents(evData.events);
        setResources((resData.resources || []).filter(r => r.visibility === 'members'));
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError(''); setProfileSuccess(''); setSavingProfile(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) { setProfileError(data.message || 'Failed to update profile.'); return; }

      updateUser(data.user);
      setProfileSuccess('Profile updated!');
      setEditingProfile(false);
    } catch (err) {
      setProfileError('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = events.filter(ev => new Date(ev.eventDate) >= today);
  const nextEvent = upcomingEvents[0];

  return (
    <div className="dash-page">
      <div className="dash-hero">
        <span className="dash-eyebrow">MEMBER PORTAL</span>
        <h1 className="dash-title">Welcome, {user?.firstName || 'Athlete'}.</h1>
        <p className="dash-subtitle">Here's what's happening with CITC.</p>
      </div>

      {error && <p className="dash-error">{error}</p>}

      {/* Quick summary strip */}
      <div className="dash-summary">
        <div className="dash-summary-item">
          <span className="dash-summary-value">{loading ? '···' : announcements.length}</span>
          <span className="dash-summary-label">Announcements</span>
        </div>
        <div className="dash-summary-item">
          <span className="dash-summary-value">{loading ? '···' : upcomingEvents.length}</span>
          <span className="dash-summary-label">Upcoming Events</span>
        </div>
        <div className="dash-summary-item">
          <span className="dash-summary-value">
            {loading ? '···' : nextEvent
              ? new Date(nextEvent.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              : '—'}
          </span>
          <span className="dash-summary-label">Next Event</span>
        </div>
        <div className="dash-summary-item">
          <span className="dash-summary-value">{loading ? '···' : resources.length}</span>
          <span className="dash-summary-label">Resources</span>
        </div>
      </div>

      <div className="dash-grid">
        {/* ── ANNOUNCEMENTS ── */}
        <div className="dash-card">
          <h2>Announcements</h2>
          {loading ? (
            <p className="dash-empty">Loading...</p>
          ) : announcements.length === 0 ? (
            <p className="dash-empty">No announcements yet. Check back soon.</p>
          ) : (
            <div className="dash-announcement-list">
              {announcements.map((a) => (
                <div className="dash-announcement" key={a.id}>
                  {a.imageUrl && <img src={a.imageUrl} alt="" className="dash-announcement-img" />}
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                  <span className="dash-meta">
                    {a.postedBy ? `${a.postedBy} · ` : ''}
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SCHEDULE ── */}
        <div className="dash-card">
          <h2>Upcoming Schedule</h2>
          {loading ? (
            <p className="dash-empty">Loading...</p>
          ) : upcomingEvents.length === 0 ? (
            <p className="dash-empty">No upcoming events scheduled yet.</p>
          ) : (
            <div className="dash-event-list">
              {upcomingEvents.map((ev) => (
                <div className="dash-event" key={ev.id}>
                  <div className="dash-event-date">
                    {new Date(ev.eventDate).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric',
                    })}
                  </div>
                  <div className="dash-event-details">
                    <h3>{ev.title}</h3>
                    {ev.location && <p className="dash-meta">{ev.location}</p>}
                    {ev.startTime && <p className="dash-meta">{ev.startTime}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RESOURCES ── */}
        <div className="dash-card">
          <h2>Resources</h2>
          {loading ? (
            <p className="dash-empty">Loading...</p>
          ) : resources.length === 0 ? (
            <p className="dash-empty">No resources shared yet.</p>
          ) : (
            <div className="dash-resource-list">
              {resources.map((r) => (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="dash-resource"
                  key={r.id}
                >
                  <span className="dash-resource-type">{r.type}</span>
                  <span className="dash-resource-title">{r.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── PROFILE ── */}
        <div className="dash-card">
          <div className="dash-profile-header">
            <h2>My Profile</h2>
            {!editingProfile && (
              <button className="dash-edit-btn" onClick={() => setEditingProfile(true)}>Edit</button>
            )}
          </div>

          {profileSuccess && <p className="dash-profile-success">{profileSuccess}</p>}
          {profileError && <p className="dash-error">{profileError}</p>}

          {editingProfile ? (
            <form onSubmit={handleProfileSave} className="dash-profile-form">
              <div className="dash-profile-photo-row">
                {profileForm.profilePictureUrl ? (
                  <img src={profileForm.profilePictureUrl} alt="" className="dash-profile-photo" />
                ) : (
                  <div className="dash-profile-avatar">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
                <FileUploadButton
                  accept="image/*"
                  onUploaded={(url) => setProfileForm(prev => ({ ...prev, profilePictureUrl: url }))}
                />
              </div>

              <div className="dash-profile-field-row">
                <div className="dash-profile-field">
                  <label>First Name</label>
                  <input name="firstName" value={profileForm.firstName} onChange={handleProfileChange} required />
                </div>
                <div className="dash-profile-field">
                  <label>Last Name</label>
                  <input name="lastName" value={profileForm.lastName} onChange={handleProfileChange} required />
                </div>
              </div>

              <div className="dash-profile-field">
                <label>Email (cannot be changed)</label>
                <input value={user?.email || ''} disabled />
              </div>

              <div className="dash-profile-field">
                <label>Phone Number</label>
                <input name="phone" value={profileForm.phone} onChange={handleProfileChange} placeholder="+1 (403) 000-0000" />
              </div>

              <div className="dash-profile-field-row">
                <div className="dash-profile-field">
                  <label>Emergency Contact Name</label>
                  <input name="emergencyContactName" value={profileForm.emergencyContactName} onChange={handleProfileChange} />
                </div>
                <div className="dash-profile-field" style={{ maxWidth: 140 }}>
                  <label>Relation</label>
                  <select name="emergencyContactRelation" value={profileForm.emergencyContactRelation} onChange={handleProfileChange}>
                    <option value="">Select...</option>
                    <option value="Parent">Parent</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="dash-profile-field">
                <label>Emergency Contact Phone</label>
                <input name="emergencyContactPhone" value={profileForm.emergencyContactPhone} onChange={handleProfileChange} />
              </div>

              <div className="dash-profile-actions">
                <button type="submit" className="dash-save-btn" disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="dash-cancel-btn" onClick={() => setEditingProfile(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="dash-profile">
                {user?.profilePictureUrl ? (
                  <img src={user.profilePictureUrl} alt="" className="dash-profile-photo" />
                ) : (
                  <div className="dash-profile-avatar">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
                <div>
                  <p className="dash-profile-name">{user?.firstName} {user?.lastName}</p>
                  <p className="dash-meta">{user?.email}</p>
                  {user?.phone && <p className="dash-meta">{user.phone}</p>}
                  {user?.dateOfBirth && (
                    <p className="dash-meta">Born {new Date(user.dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
                  )}
                </div>
              </div>
              {(user?.emergencyContactName || user?.emergencyContactPhone) && (
                <div className="dash-profile-emergency">
                  <span className="dash-profile-emergency-label">Emergency Contact</span>
                  <p className="dash-meta">
                    {user.emergencyContactName}
                    {user.emergencyContactRelation && ` (${user.emergencyContactRelation})`}
                    {(user.emergencyContactName || user.emergencyContactRelation) && user.emergencyContactPhone ? ' · ' : ''}
                    {user.emergencyContactPhone}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
