import { useState, useEffect } from 'react';
import './StaticPage.css';
import ClosingCTA from '../components/ClosingCTA';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function VolunteerPage() {
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {});
  }, []);

  const override = siteContent.volunteer_text || null;

  return (
    <>
    <div className="static-page">
      <div className="static-hero">
        <span className="static-eyebrow">MEMBERSHIP</span>
        <h1 className="static-title">Volunteer</h1>
        <p className="static-subtitle">CITC has a Mandatory Volunteer Hours Policy</p>
      </div>

      <div className="static-card">
        {override ? (
          <div className="rtf-content" dangerouslySetInnerHTML={{ __html: override }} />
        ) : (
          <>
            <h2>What's Required</h2>
            <ul>
              <li>12 volunteer hours per athlete for a full indoor/outdoor season</li>
              <li>All hours must be completed by August 31 each year</li>
              <li>Volunteer opportunities will primarily be at track meets in Calgary and Edmonton</li>
              <li>Additional opportunities will be communicated</li>
            </ul>

            <h2>Who Can Volunteer</h2>
            <ul>
              <li>The athlete (if they are not competing during a full day of a meet)</li>
              <li>Parents/guardians</li>
              <li>Relatives or family friends volunteering on behalf of the athlete</li>
            </ul>

            <h2>Opt-Out Option</h2>
            <p>
              Families who are unable to complete the required hours may choose the $300 opt-out
              fee instead.
            </p>

            <h2>Special Events (Casino/Bingo)</h2>
            <p>
              If CITC participates in a casino or bingo fundraiser, we will confirm whether those
              hours count toward the required 12 hours or are considered additional support.
            </p>
          </>
        )}
      </div>
    </div>
    <ClosingCTA />
    </>
  );
}
