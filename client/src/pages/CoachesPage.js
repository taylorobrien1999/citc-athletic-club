import { useState, useEffect } from 'react';
import citcLogoIcon from '../assets/citc-logo-icon.jpg';
import ClosingCTA from '../components/ClosingCTA';
import './CoachesPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/team-coaches`)
      .then(res => res.json())
      .then(data => setCoaches(data.coaches || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {});
  }, []);

  const goTo = (index) => {
    setCurrent(index);
    setExpanded(false);
  };
  const goPrev = () => goTo((current - 1 + coaches.length) % coaches.length);
  const goNext = () => goTo((current + 1) % coaches.length);

  const coach = coaches[current];
  const qualificationsList = coach?.qualifications
    ? coach.qualifications.split('\n').map(q => q.trim()).filter(Boolean)
    : [];

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
          <div className="coaches-carousel">
            <div className="coach-full-card">
              {coach.photoUrl ? (
                <img src={coach.photoUrl} alt={coach.name} className="coach-full-photo" />
              ) : (
                <div className="coach-full-av-lg">
                  {coach.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="coach-full-body">
                <h2 className="coach-full-name">{coach.name}</h2>
                <p className="coach-full-role">{coach.role || 'Coach'}</p>

                <div className={`coach-rtf-wrap${expanded ? ' expanded' : ''}`}>
                  {coach.fullBio && (
                    <div className="rtf-content" dangerouslySetInnerHTML={{ __html: coach.fullBio }} />
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

                {(coach.fullBio || qualificationsList.length > 0) && (
                  <button className="coach-expand-btn" onClick={() => setExpanded(prev => !prev)}>
                    {expanded ? 'Show less ↑' : 'Read more ↓'}
                  </button>
                )}
              </div>

              {coaches.length > 1 && (
                <>
                  <button className="training-arrow training-arrow-prev" onClick={goPrev} aria-label="Previous coach">‹</button>
                  <button className="training-arrow training-arrow-next" onClick={goNext} aria-label="Next coach">›</button>
                </>
              )}
            </div>

            {coaches.length > 1 && (
              <div className="training-dots">
                {coaches.map((_, i) => (
                  <button
                    key={i}
                    className={`training-dot${i === current ? ' active' : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Coach ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* JC Tribute — old logo lives here per Tessa's request. Kept as its
            own static section, same as Program Structure on the Programs page. */}
        <div className="coaches-jc-tribute">
          <div className="jc-logo">
            <img src={citcLogoIcon} alt="CITC legacy logo" className="jc-logo-img" />
          </div>
          <div className="jc-text">
            <p className="eyebrow">Club Legacy</p>
            <h3 className="jc-title">Coach John Cannon</h3>
            {siteContent.jc_tribute_text ? (
              <div className="rtf-content" dangerouslySetInnerHTML={{ __html: siteContent.jc_tribute_text }} />
            ) : (
              <p>
                CITC was founded on Coach John Cannon's vision to create an environment where
                dedicated athletes could maximize their potential and pursue excellence both on
                and off the track. One of Canada's most decorated track and field coaches, with
                international appointments spanning four Olympic Games, his legacy is defined not
                only by medals, but by integrity, character, and community — values that continue
                to guide CITC today.
              </p>
            )}
          </div>
        </div>
      </div>

      <ClosingCTA />
    </>
  );
}