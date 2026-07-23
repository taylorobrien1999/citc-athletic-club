import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Footer() {
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {});
  }, []);

  const contactEmail = siteContent.contact_email || 'CalgaryInternationalTrackClub@gmail.com';

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-badge">CITC</span>
          <p className="footer-tag">
            Calgary International Track Club<br />
            In the Habit of Excellence since 1993
          </p>
        </div>

        <div className="footer-links">
          <Link to="/the-club/coaches">Coaches</Link>
          <Link to="/the-club/training">Programs</Link>
          <Link to="/membership/fees">Membership</Link>
          <Link to="/contact">Contact</Link>
          <a href="https://www.instagram.com/calgaryinternational/" target="_blank" rel="noreferrer">Instagram</a>
        </div>

        <div className="footer-contact">
          <a href={`mailto:${contactEmail}`} className="footer-contact-item">
            {contactEmail}
          </a>
          <span className="footer-contact-divider">·</span>
          <a
            href="https://www.google.com/maps/search/?api=1&query=MNP+Sports+Centre+2225+Macleod+Trail+SE+Calgary"
            target="_blank"
            rel="noreferrer"
            className="footer-contact-item"
          >
            MNP Sports Centre — Get Directions ↗
          </a>
          <span className="footer-contact-divider">·</span>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Glenmore+Athletic+Park+5300+19+Street+SW+Calgary"
            target="_blank"
            rel="noreferrer"
            className="footer-contact-item"
          >
            Glenmore Track — Get Directions ↗
          </a>
        </div>

        <p className="footer-copy">© {new Date().getFullYear()} Calgary International Track Club. All rights reserved.</p>
      </div>
    </footer>
  );
}
