import { useState, useEffect } from 'react';
import './TrackMeetsPage.css';

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
        const upcoming = (data.events || []).filter(ev => new Date(ev.eventDate) >= today);
        setUpcomingEvents(upcoming);
      })
      .catch(() => {})
      .finally(() => setLoadingEvents(false));
  }, []);

  const indoorOverride = siteContent.track_meets_indoor || null;
  const outdoorOverride = siteContent.track_meets_outdoor || null;

  return (
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
          <h2>Indoor Season</h2>
          {indoorOverride ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{indoorOverride}</div>
          ) : (
            <table className="meets-table">
              <tbody>
                {INDOOR_MEETS.map((m) => (
                  <tr key={m.name}>
                    <td>{m.name}</td>
                    <td className="meets-when">{m.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="meets-season-card">
          <h2>Outdoor Season</h2>
          {outdoorOverride ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{outdoorOverride}</div>
          ) : (
            <table className="meets-table">
              <tbody>
                {OUTDOOR_MEETS.map((m) => (
                  <tr key={m.name}>
                    <td>{m.name}</td>
                    <td className="meets-when">{m.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {!loadingEvents && upcomingEvents.length > 0 && (
        <div className="meets-season-card" style={{ marginTop: 28 }}>
          <h2>Upcoming Scheduled Meets</h2>
          <table className="meets-table">
            <tbody>
              {upcomingEvents.map((ev) => (
                <tr key={ev.id}>
                  <td>
                    {ev.title}
                    {ev.location && <span style={{ color: '#999', fontSize: 12 }}> — {ev.location}</span>}
                  </td>
                  <td className="meets-when">
                    {new Date(ev.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="meets-note">
        Exact dates and venues are confirmed closer to each season — check Announcements or
        contact us for the latest schedule.
      </p>
    </div>
  );
}
