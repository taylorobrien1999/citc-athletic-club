import { useState } from 'react';
import './RegistrationModal.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function RegistrationModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    parentEmail: '',
    message: '',
  });

  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to submit your inquiry. Please try again.');
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit your inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ firstName: '', lastName: '', phone: '', email: '', parentEmail: '', message: '' });
    setError('');
    onClose();
  };

  return (
    <div className="reg-modal-overlay" onClick={handleClose}>
      <div className="reg-modal-card" onClick={e => e.stopPropagation()}>
        <button className="reg-modal-close" onClick={handleClose}>×</button>

        {submitted ? (
          /* ── SUCCESS SCREEN ── */
          <div className="reg-success">
            <div className="reg-success-icon">✓</div>
            <h2 className="reg-success-title">Thanks for Reaching Out!</h2>
            <p className="reg-success-body">
              We've received your inquiry about joining CITC. A coach will reach out within
              48 hours to chat about next steps.
            </p>
            <button className="reg-submit-btn" style={{ marginTop: '2rem' }} onClick={handleClose}>
              Close
            </button>
          </div>
        ) : (
          /* ── FORM ── */
          <>
            <div className="reg-modal-header">
              <span className="reg-season-tag">2026-27 SEASON</span>
              <h2 className="reg-title">INTERESTED IN JOINING CITC?</h2>
              <p className="reg-subtitle">
                Tell us a bit about yourself and a coach will follow up within 48 hours.
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
                <label>Phone Number</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (403) 000-0000" />
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
                <label>Tell Us a Bit About Yourself</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="e.g. Running experience, goals, which program you're interested in..."
                  style={{ width: '100%', fontFamily: 'inherit', fontSize: '14px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="reg-submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Inquiry →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}