import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import './AuthPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [valid, setValid] = useState(null);
  const [checkError, setCheckError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/auth/reset-password/${token}`)
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) { setCheckError(data.message || 'Invalid reset link.'); setValid(false); return; }
        setValid(true);
      })
      .catch(() => { setCheckError('Failed to validate link.'); setValid(false); });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Failed to reset password.'); return; }
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Failed to reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  if (valid === null) {
    return <div className="auth-page"><div className="auth-card"><p>Checking link...</p></div></div>;
  }

  if (!valid) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">CITC</h1>
          <h2 className="auth-subtitle">Link Not Valid</h2>
          <p className="auth-error">{checkError}</p>
          <p className="auth-footer">
            <Link to="/forgot-password" className="auth-footer-link">Request a new link</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">CITC</h1>
        <h2 className="auth-subtitle">Set a New Password</h2>

        {done ? (
          <p>Password updated! Redirecting you to sign in...</p>
        ) : (
          <>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label>New Password</label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                />
              </div>
              <div className="auth-field">
                <label>Confirm Password</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                />
              </div>
              <button type="submit" className="auth-btn" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
