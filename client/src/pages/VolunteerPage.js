import { useState, useEffect } from 'react';
import './VolunteerPage.css';
import ClosingCTA from '../components/ClosingCTA';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80';

export default function VolunteerPage() {
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {});
  }, []);

  const introOverride = siteContent.volunteer_intro_text || null;
  const detailsOverride = siteContent.volunteer_details_text || null;
  const photoUrl = siteContent.volunteer_photo || DEFAULT_PHOTO;

  return (
    <>
      <div className="volunteer-page">
        <div className="volunteer-hero">
          <span className="volunteer-eyebrow">MEMBERSHIP</span>
          <h1 className="volunteer-title">Volunteer</h1>
          <p className="volunteer-subtitle">CITC has a Mandatory Volunteer Hours Policy</p>
        </div>

        <div className="volunteer-body">
          <div className="volunteer-photo">
            <img src={photoUrl} alt="CITC volunteers at a meet" />
          </div>

          <div className="volunteer-panel">
            {introOverride ? (
              <div className="rtf-content" dangerouslySetInnerHTML={{ __html: introOverride }} />
            ) : (
              <>
                <h2>What's Required</h2>
                <ul>
                  <li>12 volunteer hours per athlete for a full indoor/outdoor season</li>
                  <li>All hours must be completed by August 31 each year</li>
                  <li>Volunteer opportunities will primarily be at track meets in Calgary and Edmonton</li>
                  <li>Additional opportunities will be communicated</li>
                </ul>

                <h3>Who Can Volunteer</h3>
                <ul>
                  <li>The athlete (if they are not competing during a full day of a meet)</li>
                  <li>Parents/guardians</li>
                  <li>Relatives or family friends volunteering on behalf of the athlete</li>
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="volunteer-below">
          {detailsOverride ? (
            <div className="rtf-content" dangerouslySetInnerHTML={{ __html: detailsOverride }} />
          ) : (
            <>
              <div className="volunteer-detail-card">
                <h3>Opt-Out Option</h3>
                <p>
                  Families who are unable to complete the required hours may choose the $300
                  opt-out fee instead.
                </p>
              </div>
              <div className="volunteer-detail-card">
                <h3>Special Events (Casino/Bingo)</h3>
                <p>
                  If CITC participates in a casino or bingo fundraiser, we will confirm whether
                  those hours count toward the required 12 hours or are considered additional
                  support.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <ClosingCTA />
    </>
  );
}
