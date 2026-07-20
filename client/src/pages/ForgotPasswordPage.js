import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Something went wrong.'); return; }
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">CITC</h1>
        <h2 className="auth-subtitle">Reset Your Password</h2>

        {submitted ? (
          <p>
            If an account with that email exists, we've sent a password reset link.
            Check your inbox.
          </p>
        ) : (
          <>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        <p className="auth-footer">
          <Link to="/login" className="auth-footer-link">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
