import { useState, useEffect } from 'react';
import citcLogoIcon from '../assets/citc-logo-icon.jpg';
import ClosingCTA from '../components/ClosingCTA';
import './CoachesPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/team-coaches`)
      .then(res => res.json())
      .then(data => setCoaches(data.coaches || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleOpen = (id) => setOpenId(prev => (prev === id ? null : id));

  return (
    <>
      <div className="coaches-page">
        <div className="coaches-page-hero">
          <span className="coaches-eyebrow">THE CLUB</span>
          <h1 className="coaches-title">Meet the Coaches</h1>
        </div>

        {loading ? (
          <p className="admin-cms-empty">Loading...</p>
        ) : coaches.length === 0 ? (
          <p className="admin-cms-empty">No coaches added yet.</p>
        ) : (
          <div className="coaches-grid">
            {coaches.map((c) => {
              const isOpen = openId === c.id;
              const qualificationsList = c.qualifications
                ? c.qualifications.split('\n').map(q => q.trim()).filter(Boolean)
                : [];

              return (
                <div className={`coach-card${isOpen ? ' open' : ''}`} key={c.id}>
                  <div className="coach-card-photo">
                    {c.photoUrl ? (
                      <img src={c.photoUrl} alt={c.name} />
                    ) : (
                      <div className="coaches-photo-noimg">
                        {c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <button className="coach-card-caption" onClick={() => toggleOpen(c.id)}>
                    <span className="coach-card-text">
                      <span className="coach-card-name">{c.name}</span>
                      <span className="coach-card-role">{c.role || 'Coach'}</span>
                    </span>
                    <span className="coach-card-icon">{isOpen ? '−' : '+'}</span>
                  </button>

                  {isOpen && (
                    <div className="coach-card-body">
                      {c.fullBio && (
                        <div className="rtf-content" dangerouslySetInnerHTML={{ __html: c.fullBio }} />
                      )}
                      {qualificationsList.length > 0 && (
                        <div className="coach-qualifications">
                          <h3>Qualifications</h3>
                          <ul>
                            {qualificationsList.map((q, i) => <li key={i}>{q}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* JC Tribute — its own static section */}
        <div className="coaches-jc-tribute">
          <div className="jc-logo">
            <img src={citcLogoIcon} alt="CITC legacy logo" className="jc-logo-img" />
          </div>
          <div className="jc-text">
            <p className="eyebrow">Club Legacy</p>
            <h3 className="jc-title">Coach John Cannon</h3>
            <p>
              CITC was founded on Coach John Cannon's vision to create an environment where
              dedicated athletes could maximize their potential and pursue excellence both on
              and off the track. One of Canada's most decorated track and field coaches, with
              international appointments spanning four Olympic Games, his legacy is defined not
              only by medals, but by integrity, character, and community — values that continue
              to guide CITC today.
            </p>
          </div>
        </div>
      </div>

      <ClosingCTA />
    </>
  );
}