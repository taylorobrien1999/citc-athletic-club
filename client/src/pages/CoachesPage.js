import { useState, useEffect } from 'react';
import citcLogoIcon from '../assets/citc-logo-icon.jpg';
import './CoachesPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/team-coaches`)
      .then(res => res.json())
      .then(data => setCoaches(data.coaches || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="coaches-page">
      <div className="coaches-page-hero">
        <span className="coaches-eyebrow">THE CLUB</span>
        <h1 className="coaches-title">Meet the Coaches</h1>
        <p className="coaches-subtitle">
          World-class coaching, personal development, and a shared commitment to
          the habit of excellence.
        </p>
      </div>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : (
        <div className="coaches-list">
          {coaches.map((c) => {
            const qualificationsList = c.qualifications
              ? c.qualifications.split('\n').map(q => q.trim()).filter(Boolean)
              : [];

            return (
              <div className="coach-full-card" key={c.id}>
                <div className="coach-full-header">
                  {c.photoUrl ? (
                    <img src={c.photoUrl} alt={c.name} className="coach-full-photo" />
                  ) : (
                    <div className="coach-full-av">
                      {c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="coach-full-name">{c.name}</h2>
                    <p className="coach-full-role">{c.role || 'Coach'}</p>
                  </div>
                </div>

                {c.fullBio && (
                  <div className="coach-full-bio">
                    <div style={{ whiteSpace: 'pre-wrap' }}>{c.fullBio}</div>
                  </div>
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
            );
          })}
        </div>
      )}

      {/* JC Tribute — old logo lives here per Tessa's request */}
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
  );
}
