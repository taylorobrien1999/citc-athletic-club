import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegistrationModal from './RegistrationModal';
import './ClosingCTA.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Shared "Join the Club" closing block used at the bottom of Coaches, Fees,
// Training Programs, Track Meets, Mission, Code of Conduct, News, Photos,
// Records, Athletics Alberta, and Volunteer -- the public/member-facing
// pages. The copy here ("New athletes and parents are invited...") is aimed
// at prospective members, so -- same as the homepage's own CTA section --
// it's hidden once someone is logged in, whether they're a regular member
// or an admin. Fixing it in this one shared component fixes it everywhere
// it's used at once.
export default function ClosingCTA() {
  const { user } = useAuth();
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {});
  }, []);

  if (user) return null;

  return (
    <section className="cta-section closing-cta">
      <RegistrationModal isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} />
      <div className="cta-inner">
        <p className="cta-eyebrow">Join the Club</p>
        {siteContent.home_cta_title ? (
          <h2 className="cta-title" dangerouslySetInnerHTML={{ __html: siteContent.home_cta_title }} />
        ) : (
          <h2 className="cta-title">Start Your<br />Journey</h2>
        )}
        {siteContent.home_cta_sub ? (
          <div className="cta-sub rtf-content" dangerouslySetInnerHTML={{ __html: siteContent.home_cta_sub }} />
        ) : (
          <p className="cta-sub">
            New athletes and parents are invited to submit a Registration Inquiry — a coach
            will follow up within 48 hours to discuss the best training option for you. A
            valid Athletics Alberta membership is required before your first session.
          </p>
        )}
        <div className="cta-btns">
          <button className="btn-primary" onClick={() => setIsRegModalOpen(true)}>Register Now</button>
          <Link to="/contact" className="btn-outline-dark">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}