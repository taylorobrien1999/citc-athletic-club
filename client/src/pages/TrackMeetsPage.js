import { useState, useEffect } from 'react';
import { parseLocalDate } from '../utils/dateUtils';
import './TrackMeetsPage.css';
import ClosingCTA from '../components/ClosingCTA';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const INDOOR_MEETS = [
  { name: 'Dino Meets', when: 'Dec / Jan' },
  { name: 'Alberta Indoor Games', when: 'Jan' },
  { name: 'Golden Bear', when: 'Feb' },
  { name: 'Indoor Provincials', when: 'March' },
  { name: 'Indoor Nationals', when: 'March' },
];

const OUTDOOR_MEETS = [
  { name: 'Spring Challenge', when: 'May' },
  { name: "Gord's Series", when: 'May / June' },
  { name: 'Caltaf', when: 'July' },
  { name: 'Sherwood Park', when: 'July' },
  { name: 'Nationals U20 / Senior', when: 'June (varies year to year)' },
  { name: 'Legion Nationals U16 / U18', when: 'August' },
];

export default function TrackMeetsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then(res => res.json())
      .then(data => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const upcoming = (data.events || []).filter(ev => parseLocalDate(ev.eventDate) >= today);
        setUpcomingEvents(upcoming);
      })
      .catch(() => {})
      .finally(() => setLoadingEvents(false));
  }, []);

  const indoorOverride = siteContent.track_meets_indoor || null;
  const outdoorOverride = siteContent.track_meets_outdoor || null;

  return (
    <>
      <div className="meets-page">
        <div className="meets-hero">
          <span className="meets-eyebrow">THE CLUB</span>
          <h1 className="meets-title">Track Meets</h1>
          <p className="meets-subtitle">
            CITC athletes compete year-round across Alberta and nationally, indoors and out.
          </p>
        </div>

        <div className="meets-grid">
          <div className="meets-season-card">
            <h2>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meets-heading-icon"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
              Indoor Season
            </h2>
            {indoorOverride ? (
              <div className="rtf-content" dangerouslySetInnerHTML={{ __html: indoorOverride }} />
            ) : (
              <div className="meets-list">
                {INDOOR_MEETS.map((m) => (
                  <div className="meets-list-item" key={m.name}>
                    <span className="meets-list-name">{m.name}</span>
                    <span className="meets-list-when">{m.when}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="meets-season-card">
            <h2>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="meets-heading-icon"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              Outdoor Season
            </h2>
            {outdoorOverride ? (
              <div className="rtf-content" dangerouslySetInnerHTML={{ __html: outdoorOverride }} />
            ) : (
              <div className="meets-list">
                {OUTDOOR_MEETS.map((m) => (
                  <div className="meets-list-item" key={m.name}>
                    <span className="meets-list-name">{m.name}</span>
                    <span className="meets-list-when">{m.when}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!loadingEvents && upcomingEvents.length > 0 && (
          <div className="meets-upcoming-card">
            <span className="meets-upcoming-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Upcoming Scheduled Meets
            </span>
            <div className="meets-upcoming-list">
              {upcomingEvents.map((ev) => (
                <div className="meets-upcoming-item" key={ev.id}>
                  <div className="meets-upcoming-date">
                    {new Date(ev.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                  <div>
                    <div className="meets-upcoming-name">{ev.title}</div>
                    {ev.location && (
                      <div className="meets-upcoming-location">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {ev.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="meets-note">
          Exact dates and venues are confirmed closer to each season — check Announcements or
          contact us for the latest schedule.
        </p>
      </div>

      <ClosingCTA />
    </>
  );
}
