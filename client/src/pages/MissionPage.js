import { useState, useEffect } from 'react';
import './MissionPage.css';
import ClosingCTA from '../components/ClosingCTA';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80';

const DEI_PARAGRAPHS = [
  "Our track and field program is committed to creating an environment where every athlete feels valued, respected, and supported in reaching their full potential.",
  "We believe that diversity strengthens our team. We welcome athletes of all backgrounds, identities, and experiences, and recognize that each individual brings unique strengths that contribute to our collective success.",
  "We are dedicated to equity by ensuring fair access to coaching, training resources, competition opportunities, and support systems \u2014 because every athlete deserves the opportunity to succeed.",
];

const DEI_COMMITMENTS = [
  'Promoting respect and sportsmanship in all interactions',
  'Supporting one another on and off the track',
  'Listening to and learning from different perspectives',
  'Addressing barriers that may limit participation or performance',
  'Continuously improving our culture through education and open dialogue',
];

export default function MissionPage() {
  const [siteContent, setSiteContent] = useState({});
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {})
      .finally(() => setContentLoaded(true));
  }, []);

  const displayedDeiText = siteContent.mission_dei_text || null;
  const displayedCommitmentsText = siteContent.mission_commitments_text || null;
  const photoUrl = siteContent.mission_photo || DEFAULT_PHOTO;

  return (
    <>
      <div className="mission-page">
        <div className="mission-hero">
          <span className="mission-eyebrow">THE CLUB</span>
          <h1 className="mission-title">Our Mission</h1>
        </div>

        <div className="mission-body">
          <div className="mission-photo">
            {contentLoaded && <img src={photoUrl} alt="CITC athletes with coach" />}
          </div>

          <div className="mission-panel">
            {displayedDeiText ? (
              <div className="rtf-content" dangerouslySetInnerHTML={{ __html: displayedDeiText }} />
            ) : (
              <>
                <h2>Our Commitment to Diversity, Equity &amp; Inclusion</h2>
                {DEI_PARAGRAPHS.map((p, i) => <p key={i}>{p}</p>)}
              </>
            )}
          </div>
        </div>

        <div className="mission-below">
          {displayedCommitmentsText ? (
            <div className="rtf-content" dangerouslySetInnerHTML={{ __html: displayedCommitmentsText }} />
          ) : (
            <>
              <h3>As a team, we commit to:</h3>
              <ul>
                {DEI_COMMITMENTS.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
              <div className="mission-close">
                Together, we strive to build not only faster athletes, but a stronger, more
                inclusive team community.
              </div>
            </>
          )}
        </div>
      </div>

      <ClosingCTA />
    </>
  );
}
