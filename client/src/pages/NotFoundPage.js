import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthBackground from '../components/AuthBackground';
import citcLogo from '../assets/citc-logo-full.png';
import './AuthPage.css';
import './NotFoundPage.css';

// Catch-all page for any URL that doesn't match a real route. Previously
// unknown URLs silently redirected to the homepage with no explanation --
// this gives the visitor a clear "page not found" message and a way back,
// same as any normal website's 404 page.
export default function NotFoundPage() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="auth-page">
      <AuthBackground />
      <div className="auth-card notfound-card">
        <img src={citcLogo} alt="CITC" className="auth-logo" />
        <p className="notfound-code">404</p>
        <h2 className="auth-subtitle">Page Not Found</h2>
        <p className="notfound-text">
          The page you're looking for doesn't exist, may have moved, or the link may be broken.
        </p>
        <Link to={user ? (isAdmin ? '/admin' : '/dashboard') : '/'} className="auth-btn notfound-home-btn">
          {user ? 'Back to Dashboard' : 'Back to Home'}
        </Link>
      </div>
    </div>
  );
}