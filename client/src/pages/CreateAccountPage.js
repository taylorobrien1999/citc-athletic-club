import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordInput from '../components/PasswordInput';
import './CreateAccountPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function CreateAccountPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/account-invites/${token}`)
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) { setError(data.message || 'Invalid invite link.'); return; }
        setInvite(data);
      })
      .catch(() => setError('Failed to load invite.'))
      .finally(() => setLoading(false));
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
      const res = await fetch(`${API_URL}/api/account-invites/${token}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to create account.');
        return;
      }

      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="create-account-page"><p className="create-account-loading">Loading...</p></div>;
  }

  if (error && !invite) {
    return (
      <div className="create-account-page">
        <div className="create-account-card">
          <h1>Invite Not Valid</h1>
          <p className="create-account-error">{error}</p>
          <p>If you think this is a mistake, please contact CITC directly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-account-page">
      <div className="create-account-card">
        <span className="create-account-eyebrow">WELCOME TO CITC</span>
        <h1>Create Your Account</h1>
        <p className="create-account-sub">
          Hi {invite?.firstName}, set a password below to activate your account
          ({invite?.email}).
        </p>

        {error && <p className="create-account-error">{error}</p>}

        <form onSubmit={handleSubmit} className="create-account-form">
          <div className="create-account-field">
            <label>Password</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
            />
          </div>
          <div className="create-account-field">
            <label>Confirm Password</label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
            />
          </div>
          <button className="create-account-submit" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
