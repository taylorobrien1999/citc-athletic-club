import { useState } from 'react';
import './RegistrationModal.css';

export default function RegistrationModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    parentEmail: '',
    dob: '2026-06-17', 
    yearsRunning: '',
    indoorGoals: '',
    outdoorGoals: '',
    ackConduct: false,
    ackVolunteer: false,
    ackFees: false,
    ackAttendance: false,
    parentSignature: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // NOTE: might need to update API to handle this new intake payload
      // Since there's no password, this likely pings a different endpoint than your old auth.js
      console.log('Submitting intake form:', form);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onClose(); // Close modal on success
      // Optional: Trigger a success toast notification here (as per prototype)
    } catch (err) {
      setError('Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-modal-overlay" onClick={onClose}>
      <div className="reg-modal-card" onClick={e => e.stopPropagation()}>
        <button className="reg-modal-close" onClick={onClose}>×</button>
        
        <div className="reg-modal-header">
          <span className="reg-season-tag">2026-27 SEASON</span>
          <h2 className="reg-title">CITC REGISTRATION</h2>
          <p className="reg-subtitle">
            Complete all fields below. A coach will follow up within 48 hours. A valid Athletics Alberta membership is required before your first session.
          </p>
        </div>

        {error && <p className="reg-error">{error}</p>}

        <form onSubmit={handleSubmit} className="reg-form">
          <div className="reg-row">
            <div className="reg-field">
              <label>First Name *</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First" required />
            </div>
            <div className="reg-field">
              <label>Last Name *</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last" required />
            </div>
          </div>

          <div className="reg-field">
            <label>Phone Number *</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (403) 000-0000" required />
          </div>

          <div className="reg-field">
            <label>Your Email Address *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>

          <div className="reg-field">
            <label>Parent/Guardian Email <span className="light-text">(if under 18)</span></label>
            <input type="email" name="parentEmail" value={form.parentEmail} onChange={handleChange} placeholder="parent@example.com" />
          </div>

          <div className="reg-field">
            <label>Date of Birth *</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
          </div>

          <div className="reg-field">
            <label>Years Running *</label>
            <select name="yearsRunning" value={form.yearsRunning} onChange={handleChange} required>
              <option value="" disabled>e.g. 3</option>
              <option value="0-1">0-1 Years</option>
              <option value="2-3">2-3 Years</option>
              <option value="4+">4+ Years</option>
            </select>
          </div>

          <div className="reg-field">
            <label>Indoor Goals for 2026 *</label>
            <input type="text" name="indoorGoals" value={form.indoorGoals} onChange={handleChange} placeholder="e.g. Sub-7.8 in 60m hurdles, qualify for provincials" required />
          </div>

          <div className="reg-field">
            <label>Outdoor Goals for 2026 *</label>
            <input type="text" name="outdoorGoals" value={form.outdoorGoals} onChange={handleChange} placeholder="e.g. Run 100m under 11s, compete at nationals" required />
          </div>

          <div className="reg-acknowledgements">
            <h3>ACKNOWLEDGEMENTS</h3>
            
            <label className="reg-checkbox-label">
              <input type="checkbox" name="ackConduct" checked={form.ackConduct} onChange={handleChange} required />
              <span>I have read and understood the <strong>CITC Code of Conduct</strong> and agree to uphold its standards as a member of the club. <em>(Initials confirm agreement)</em></span>
            </label>

            <label className="reg-checkbox-label">
              <input type="checkbox" name="ackVolunteer" checked={form.ackVolunteer} onChange={handleChange} required />
              <span>I understand I must provide <strong>12 hours of volunteer commitment</strong> annually (or pay the $300 opt-out fee).</span>
            </label>

            <label className="reg-checkbox-label">
              <input type="checkbox" name="ackFees" checked={form.ackFees} onChange={handleChange} required />
              <span>I understand I will be <strong>charged the meet entry fee</strong> for any races I don't run in if CITC has registered me.</span>
            </label>

            <label className="reg-checkbox-label">
              <input type="checkbox" name="ackAttendance" checked={form.ackAttendance} onChange={handleChange} required />
              <span>I understand I must <strong>attend 85% of practices</strong> in person to be entered in meets.</span>
            </label>
          </div>

          <div className="reg-field">
            <label>Parent/Guardian Signature <span className="light-text">(if under 18 — type full name)</span></label>
            <input type="text" name="parentSignature" value={form.parentSignature} onChange={handleChange} placeholder="Full name as signature" />
          </div>

          <button type="submit" className="reg-submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Registration →'}
          </button>
        </form>
      </div>
    </div>
  );
}