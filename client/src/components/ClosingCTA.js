import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationModal from './RegistrationModal';
import './ClosingCTA.css';

export default function ClosingCTA() {
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  return (
    <section className="cta-section closing-cta">
      <RegistrationModal isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} />
      <div className="cta-inner">
        <p className="cta-eyebrow">Join the Club</p>
        <h2 className="cta-title">Start Your<br />Journey</h2>
        <p className="cta-sub">
          New athletes and parents are invited to submit a Registration Inquiry — a coach
          will follow up within 48 hours to discuss the best training option for you. A
          valid Athletics Alberta membership is required before your first session.
        </p>
        <div className="cta-btns">
          <button className="btn-primary" onClick={() => setIsRegModalOpen(true)}>Register Now</button>
          <Link to="/contact" className="btn-outline-dark">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
