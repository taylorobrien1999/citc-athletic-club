import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FileUploadButton from '../components/FileUploadButton';
import { parseLocalDate } from '../utils/dateUtils';
import './DashboardPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function DashboardPage() {
  const { user, token, updateUser } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Per-announcement expand state — only relevant for Members Only posts,
  // since Public ones link out to the News page instead of expanding here.
  const [expandedAnnouncementIds, setExpandedAnnouncementIds] = useState({});
  const toggleAnnouncementExpanded = (id) =>
    setExpandedAnnouncementIds(prev => ({ ...prev, [id]: !prev[id] }));

  // Detects whether each announcement's real content actually overflows the
  // collapsed height — the fade overlay should only appear when genuinely
  // needed, otherwise short announcements show a decorative "highlight"
  // sitting over text that was never actually being clipped.
  const [overflowingIds, setOverflowingIds] = useState({});
  const bodyRefs = useState(() => ({}))[0];

  useEffect(() => {
    const next = {};
    Object.entries(bodyRefs).forEach(([id, el]) => {
      if (el && el.scrollHeight > el.clientHeight + 2) next[id] = true;
    });
    setOverflowingIds(next);
  }, [announcements]); // eslint-disable-line react-hooks/exhaustive-deps

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

        setAnnouncements(annData.announcements || []);
        setEvents(evData.events || []);
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
  const upcomingEvents = events.filter(ev => parseLocalDate(ev.eventDate) >= today);
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
          <div className="dash-card-header">
            <h2>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dash-heading-icon"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              Announcements
            </h2>
          </div>
          {loading ? (
            <p className="dash-empty">Loading...</p>
          ) : announcements.length === 0 ? (
            <p className="dash-empty">No announcements yet. Check back soon.</p>
          ) : (
            <div className="dash-announcement-list dash-scroll-box">
              {announcements.map((a) => {
                const isPublic = a.visibility !== 'members';
                const isExpanded = !!expandedAnnouncementIds[a.id];
                return (
                  <div className="dash-announcement" key={a.id}>
                    {a.imageUrl && <img src={a.imageUrl} alt="" className="dash-announcement-img" />}
                    <h3>{a.title}</h3>

                    {isPublic ? (
                      <>
                        <div
                          className={`dash-rtf-wrap${overflowingIds[a.id] ? ' needs-fade' : ''}`}
                          ref={(el) => { bodyRefs[a.id] = el; }}
                        >
                          <div className="rtf-content" dangerouslySetInnerHTML={{ __html: a.body }} />
                        </div>
                        <Link to="/news" className="dash-readmore-link">Read more on News →</Link>
                      </>
                    ) : (
                      <>
                        <div
                          className={`dash-rtf-wrap${isExpanded ? ' expanded' : overflowingIds[a.id] ? ' needs-fade' : ''}`}
                          ref={(el) => { bodyRefs[a.id] = el; }}
                        >
                          <div className="rtf-content" dangerouslySetInnerHTML={{ __html: a.body }} />
                        </div>
                        <div className="dash-announcement-footer">
                          {overflowingIds[a.id] && (
                            <button className="dash-readmore-link" onClick={() => toggleAnnouncementExpanded(a.id)}>
                              {isExpanded ? 'Show less ↑' : 'Read more ↓'}
                            </button>
                          )}
                          <span className="dash-members-tag">Members Only</span>
                        </div>
                        {isExpanded && (
                          <span className="dash-meta dash-announcement-meta">
                            {a.postedBy ? `${a.postedBy} · ` : ''}
                            {new Date(a.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── SCHEDULE ── */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dash-heading-icon"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Upcoming Schedule
            </h2>
          </div>
          {loading ? (
            <p className="dash-empty">Loading...</p>
          ) : upcomingEvents.length === 0 ? (
            <p className="dash-empty">No upcoming events scheduled yet.</p>
          ) : (
            <div className="dash-event-list dash-scroll-box">
              {upcomingEvents.map((ev) => (
                <div className="dash-event" key={ev.id}>
                  <div className="dash-event-date">
                    {new Date(ev.eventDate).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric',
                    })}
                  </div>
                  <div className="dash-event-details">
                    <h3>{ev.title}</h3>
                    {ev.location && (
                      <p className="dash-meta dash-meta-location">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {ev.location}
                      </p>
                    )}
                    {ev.startTime && <p className="dash-meta">{ev.startTime}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RESOURCES ── */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dash-heading-icon"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              Resources
            </h2>
          </div>
          {loading ? (
            <p className="dash-empty">Loading...</p>
          ) : resources.length === 0 ? (
            <p className="dash-empty">No resources shared yet.</p>
          ) : (
            <div className="dash-resource-list dash-scroll-box">
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
            <h2>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dash-heading-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              My Profile
            </h2>
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
