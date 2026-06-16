import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_ITEMS = [
  {
    label: 'The Club',
    dropdown: [
      { label: 'Coaches',          to: '/the-club/coaches' },
      { label: 'Training Programs', to: '/the-club/training' },
      { label: 'Track Meets',      to: '/the-club/meets' },
      { divider: true },
      { label: 'Mission Statement', to: '/the-club/mission' },
      { label: 'Code of Conduct',  to: '/the-club/conduct' },
    ],
  },
  {
    label: 'Membership',
    dropdown: [
      { label: 'Fees',              to: '/membership/fees' },
      { label: 'Athletics Alberta', to: '/membership/athletics-alberta' },
      { label: 'Volunteer',         to: '/membership/volunteer' },
      { divider: true },
      { label: '2-Week Trial',      to: '/membership/trial' },
      { label: 'Register Now →',   to: '/register', cta: true },
    ],
  },
  {
    label: 'News & Updates',
    dropdown: [
      { label: 'News',         to: '/news' },
      { label: 'Photos',       to: '/news/photos' },
      { label: 'Club Records', to: '/news/records' },
    ],
  },
  { label: 'Contact',  to: '/contact' },
  { label: 'Sponsors', to: '/sponsors' },
];

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setDrawerOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleDropdown = (label) =>
    setOpenDropdown(prev => (prev === label ? null : label));

  const handleLogout = () => {
    logout();
    navigate('/');
    setDrawerOpen(false);
  };

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} ref={navRef}>
        <div className="nav-inner">

          {/* Logo */}
          <Link to="/" className="logo" onClick={() => setOpenDropdown(null)}>
            <span className="logo-badge">CITC</span>
            <span className="logo-name">
              <strong>Calgary International Track Club</strong>
              <span>In the Habit of Excellence</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="nav-links">
            <li className="nav-item">
              <Link to="/" className="nav-btn">Home</Link>
            </li>

            {NAV_ITEMS.map((item) =>
              item.dropdown ? (
                <li
                  key={item.label}
                  className={`nav-item${openDropdown === item.label ? ' open' : ''}`}
                >
                  <button
                    className="nav-btn"
                    onClick={() => toggleDropdown(item.label)}
                  >
                    {item.label}
                    <svg viewBox="0 0 10 6" fill="none">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="dropdown">
                    {item.dropdown.map((dd, i) =>
                      dd.divider ? (
                        <hr key={i} />
                      ) : (
                        <Link
                          key={dd.to}
                          to={dd.to}
                          className={dd.cta ? 'dd-cta' : ''}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {dd.label}
                        </Link>
                      )
                    )}
                  </div>
                </li>
              ) : (
                <li key={item.label} className="nav-item">
                  <Link to={item.to} className="nav-btn">{item.label}</Link>
                </li>
              )
            )}

            {/* Auth buttons */}
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-btn">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <button className="nav-btn nav-register" onClick={handleLogout}>
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-btn">Sign In</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-btn nav-register">
                    Register Now
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Mobile hamburger */}
          <button
            className={`nav-hamburger${drawerOpen ? ' open' : ''}`}
            onClick={() => setDrawerOpen(prev => !prev)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer${drawerOpen ? ' open' : ''}`}>
        <Link to="/"        className="drawer-link" onClick={() => setDrawerOpen(false)}>Home</Link>

        <div className="drawer-section-label">The Club</div>
        <Link to="/the-club/coaches"  className="drawer-sub" onClick={() => setDrawerOpen(false)}>Coaches</Link>
        <Link to="/the-club/training" className="drawer-sub" onClick={() => setDrawerOpen(false)}>Training Programs</Link>
        <Link to="/the-club/meets"    className="drawer-sub" onClick={() => setDrawerOpen(false)}>Track Meets</Link>
        <Link to="/the-club/mission"  className="drawer-sub" onClick={() => setDrawerOpen(false)}>Mission Statement</Link>
        <Link to="/the-club/conduct"  className="drawer-sub" onClick={() => setDrawerOpen(false)}>Code of Conduct</Link>

        <div className="drawer-section-label">Membership</div>
        <Link to="/membership/fees"              className="drawer-sub" onClick={() => setDrawerOpen(false)}>Fees</Link>
        <Link to="/membership/athletics-alberta" className="drawer-sub" onClick={() => setDrawerOpen(false)}>Athletics Alberta</Link>
        <Link to="/membership/volunteer"         className="drawer-sub" onClick={() => setDrawerOpen(false)}>Volunteer</Link>
        <Link to="/membership/trial"             className="drawer-sub" onClick={() => setDrawerOpen(false)}>2-Week Trial</Link>

        <div className="drawer-section-label">News & Updates</div>
        <Link to="/news"         className="drawer-sub" onClick={() => setDrawerOpen(false)}>News</Link>
        <Link to="/news/photos"  className="drawer-sub" onClick={() => setDrawerOpen(false)}>Photos</Link>
        <Link to="/news/records" className="drawer-sub" onClick={() => setDrawerOpen(false)}>Club Records</Link>

        <Link to="/contact"  className="drawer-link" onClick={() => setDrawerOpen(false)}>Contact</Link>
        <Link to="/sponsors" className="drawer-link" onClick={() => setDrawerOpen(false)}>Sponsors</Link>

        {user ? (
          <>
            <Link to="/dashboard" className="drawer-link" onClick={() => setDrawerOpen(false)}>Dashboard</Link>
            <button className="drawer-register" onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="drawer-link" onClick={() => setDrawerOpen(false)}>Sign In</Link>
            <Link to="/register" className="drawer-register" onClick={() => setDrawerOpen(false)}>Register Now</Link>
          </>
        )}
      </div>
    </>
  );
}
