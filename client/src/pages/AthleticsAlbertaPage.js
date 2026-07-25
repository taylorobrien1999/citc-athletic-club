import { useState, useEffect } from 'react';
import './AthleticsAlbertaPage.css';
import ClosingCTA from '../components/ClosingCTA';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80';

export default function AthleticsAlbertaPage() {
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {});
  }, []);

  const override = siteContent.athletics_alberta_text || null;
  const photoUrl = siteContent.athletics_alberta_photo || DEFAULT_PHOTO;

  return (
    <>
      <div className="aa-page">
        <div className="aa-hero">
          <span className="aa-eyebrow">MEMBERSHIP</span>
          <h1 className="aa-title">Athletics Alberta</h1>
        </div>

        <div className="aa-body">
          <div className="aa-photo">
            <img src={photoUrl} alt="CITC athlete training" />
          </div>

          <div className="aa-panel">
            {override ? (
              <div className="rtf-content" dangerouslySetInnerHTML={{ __html: override }} />
            ) : (
              <>
                <p>
                  A valid Athletics Alberta (AA) membership is required for all athletes training
                  with Calgary International Track Club. This membership ensures athletes are
                  properly registered, insured, and eligible to compete in sanctioned events
                  throughout the season.
                </p>
                <p>
                  If you are unsure which type of registration is appropriate for you or your
                  athlete, please reach out to us and we would be happy to assist.
                </p>
                <p>
                  Learn more or register through Athletics Alberta:<br />
                  <a
                    href="https://athleticsreg.ca/#!/memberships/athletics-alberta-2026-membership"
                    target="_blank"
                    rel="noreferrer"
                  >
                    athleticsreg.ca — Athletics Alberta 2026 Membership
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <ClosingCTA />
    </>
  );
}
