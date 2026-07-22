import { useState, useEffect } from 'react';
import './ContactPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {});
  }, []);

  const contactEmail = siteContent.contact_email || 'CalgaryInternationalTrackClub@gmail.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to send your message. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <span className="contact-eyebrow">GET IN TOUCH</span>
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-subtitle">
          Have questions about training programs, registration, or sponsorship opportunities?
          We'd love to hear from you.
        </p>
      </div>

      <div className="contact-grid">
        {/* ── LEFT: FORM ── */}
        <div className="contact-form-card">
          {submitted ? (
            <div className="contact-success">
              <div className="contact-success-icon">✓</div>
              <h2>Message Sent!</h2>
              <p>Thanks for reaching out — a member of our team will get back to you as soon as possible.</p>
            </div>
          ) : (
            <>
              <h2 className="contact-form-heading">Send Us a Message</h2>

              {error && <p className="contact-error">{error}</p>}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-field">
                  <label>Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </div>

                <div className="contact-field">
                  <label>Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                </div>

                <div className="contact-field">
                  <label>Subject</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" />
                </div>

                <div className="contact-field">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>

                <button type="submit" className="contact-submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>
              </form>

              <p className="contact-direct-email">
                Prefer email? Reach us directly at{' '}
                <a href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </p>
            </>
          )}
        </div>

        {/* ── RIGHT: FIND US ── */}
        <div className="contact-info-card">
          <h2 className="contact-form-heading">Find Us</h2>
          <p className="contact-info-intro">Calgary International Track Club trains year-round in Calgary.</p>

          <div className="contact-location">
            {siteContent.contact_indoor_location ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>{siteContent.contact_indoor_location}</div>
            ) : (
              <>
                <h3>Indoor Season</h3>
                <p>MNP Sports Centre</p>
                <p>2225 Macleod Trail SE</p>
                <p>Calgary, AB T2G 5B6</p>
                <div className="contact-schedule">
                  <p><span>Monday</span> 4:30–6pm</p>
                  <p><span>Wednesday</span> 4:30–6:30pm</p>
                  <p><span>Friday</span> 4:30–6pm</p>
                  <p><span>Saturday</span> 1:30–2:30pm</p>
                </div>
              </>
            )}
          </div>

          <div className="contact-location">
            {siteContent.contact_outdoor_location ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>{siteContent.contact_outdoor_location}</div>
            ) : (
              <>
                <h3>Outdoor Season</h3>
                <p>Glenmore Track (Glenmore Athletic Park)</p>
                <p>5300 19 Street SW</p>
                <p>Calgary, AB T3E 1P6</p>
                <div className="contact-schedule">
                  <p><span>Monday</span> 5–7pm</p>
                  <p><span>Wednesday</span> 5–7pm</p>
                  <p><span>Friday</span> 5–7pm</p>
                  <p><span>Saturday</span> 2–3:30pm</p>
                </div>
              </>
            )}
          </div>

          <div className="contact-social">
            <a href="https://www.instagram.com/calgaryinternational/" target="_blank" rel="noreferrer">
              Follow us on Instagram →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
