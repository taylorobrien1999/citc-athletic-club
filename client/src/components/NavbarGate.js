import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

// The admin section only grows its OWN topbar/hamburger/"Back to site" link
// below 768px (see AdminPage.css). Above 768px that admin topbar is
// display:none and the sidebar is always visible instead, so there's nothing
// for the public Navbar to conflict with — it should stay put on desktop.
// Only hide the public Navbar on admin routes AT mobile widths, where showing
// both caused the double-hamburger problem.
const MOBILE_BREAKPOINT = 768;

export default function NavbarGate() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (isAdminRoute && isMobile) return null;

  return <Navbar />;
}
