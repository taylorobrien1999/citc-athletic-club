import { useState, useEffect } from 'react';
import './StaticPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function FeesPage() {
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {});
  }, []);

  const feesOverride = siteContent.fees_text || null;

  return (
    <div className="static-page">
      <div className="static-hero">
        <span className="static-eyebrow">MEMBERSHIP</span>
        <h1 className="static-title">Fees</h1>
      </div>

      <div className="static-card">
        {feesOverride ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{feesOverride}</div>
        ) : (
          <p>
            For current program fees and registration details, please contact us directly —
            we're happy to provide information and discuss the best training option for you.
          </p>
        )}
        <a href="mailto:CalgaryInternationalTrackClub@gmail.com" className="static-email-cta">
          CalgaryInternationalTrackClub@gmail.com
        </a>
      </div>
    </div>
  );
}
