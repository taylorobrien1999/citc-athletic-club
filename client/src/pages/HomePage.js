import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import citcLogoFull from '../assets/citc-logo-full.png';
import citcLogoIcon from '../assets/citc-logo-icon.jpg';
import RegistrationModal from '../components/RegistrationModal';
import './HomePage.css';

// Coaches (revised per Tessa, Dani, Cindy)  1.1
const COACHES = [
  {
    initials: 'TG',
    name: 'Tessa Gray-Burnett',
    role: 'Coach',
    bio: 'Former 400m hurdles athlete with 17 years of competitive experience. 4× All-Canadian, Team Canada representative, and NCCP Certified Performance Coach.',
  },
  {
    initials: 'DM',
    name: 'Dani Marland',
    role: 'Coach',
    bio: 'Coaches all event groups from 60m to 6k XC. Passionate about speed-first development and helping athletes reach their full potential on and off the track.',
  },
  {
    initials: 'NI',
    name: 'Nicole',
    role: 'Coach',
    bio: "Brings energy and expertise across all event groups, contributing to CITC's culture of excellence, discipline, and athlete development.",
  },
];

// ── Programs 
const PROGRAMS = [
  {
    tag: 'Program',
    title: 'Sprint & Speed',
    img: '/citc-images/prog-sprint.jpg',
    desc: 'Maximum speed, power, and technical precision. Training prioritizes acceleration mechanics, maximal velocity development, and neuromuscular efficiency.',
  },
  {
    tag: 'Program',
    title: 'Hurdles',
    img: '/citc-images/prog-hurdles.jpg',
    desc: 'Sprint speed combined with rhythm, coordination, and technical mastery. Athletes are developed as sprinters first — hurdlers second.',
  },
  {
    tag: 'Program',
    title: 'Middle Distance',
    img: '/citc-images/prog-middledist.jpg',
    desc: 'The 600m–1500m — where speed, strength, and endurance intersect. Fast, durable, and tactically intelligent competitors.',
  },
];

// ── Hero slideshow images ──────────────────────────────────────────────────
const SLIDES = [
  '/citc-images/hero-1.jpg',
  '/citc-images/hero-2.jpg',
  '/citc-images/hero-3.jpg',
  '/citc-images/hero-4.jpg',
  '/citc-images/hero-5.jpg',
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(prev => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="home">
      <RegistrationModal isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero">

        <div className="hero-slides">
          {SLIDES.map((src, i) => (
            <div key={src} className={`slide${i === slide ? ' active' : ''}`}>
              <img src={src} alt="" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="hero-overlay" />

        <div className="hero-body">
          <div className="hero-content-wrap">
            {/* Logo in hero — swap src for new logo when Tessa sends it */}
            <img
              src={citcLogoFull}
              alt="Calgary International Track Club"
              className="hero-logo"
            />
            <h1 className="hero-title">
              In the<br />
              <span className="hero-title-accent">Habit of</span><br />
              Excellence
            </h1>
            <p className="hero-sub">
              A values driven track club since 1993. Developing high-performance athletes
              and champions in life across Calgary and beyond.
            </p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => setIsRegModalOpen(true)}>Register Now</button>
              <Link to="/the-club/coaches" className="btn-outline">Meet the Coaches</Link>
            </div>
          </div>
        </div>

        {/* Slideshow dots + counter */}
        <div className="hero-footer">
          <div className="hero-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`dot${i === slide ? ' active' : ''}`}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <span className="hero-counter">
            {String(slide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>
        </div>

      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section className="about-section">
        <div className="about-inner">
          <div className="about-text">
            <p className="eyebrow">About CITC</p>
            <h2 className="section-title">
              Calgary<br />
              International<br />
              Track Club
            </h2>
            <p className="body-text">
              CITC has been <strong>In the Habit of Excellence</strong> since 1993. Founded on
              Coach John Cannon's vision to create an environment where dedicated athletes
              could maximize their potential — on and off the track.
            </p>
            <p className="body-text">
              Over three decades, CITC has grown into one of Canada's most respected
              high-performance track and field clubs, producing City, Provincial, National,
              and Olympic-level athletes.
            </p>
            <Link to="/the-club/mission" className="text-link">Our Mission & Values →</Link>
          </div>
          <div className="about-image-wrap">
            <img src="/citc-images/about.jpg" alt="CITC athletes — team camaraderie" />
            <div className="about-badge">
              <div className="badge-num">1993</div>
              <div className="badge-lbl">Founded</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ─────────────────────────────────────────────────────── */}
      <section className="programs-section">
        <div className="programs-inner">
          <p className="eyebrow">Training Programs</p>
          <h2 className="section-title">Built for<br />Complete Athletes</h2>
          <div className="programs-grid">
            {PROGRAMS.map((p) => (
              <div className="prog-card" key={p.title}>
                <div className="prog-img-wrap">
                  <span className="prog-tag">{p.tag}</span>
                  <img src={p.img} alt={p.title} />
                </div>
                <div className="prog-body">
                  <div className="prog-title">{p.title}</div>
                  <p className="prog-desc">{p.desc}</p>
                  <Link to="/the-club/training" className="prog-link">Learn more →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COACHES ──────────────────────────────────────────────────────── */}
      <section className="coaches-section">
        <div className="coaches-inner">
          <p className="eyebrow">Coaching Staff</p>
          <h2 className="section-title">World-Class Coaches.<br />Personal Development.</h2>
          <div className="coaches-grid">
            {COACHES.map((c) => (
              <div className="coach-card" key={c.name}>
                <div className="coach-av">{c.initials}</div>
                <div className="coach-name">{c.name}</div>
                <div className="coach-role">{c.role}</div>
                <p className="coach-detail">{c.bio}</p>
              </div>
            ))}
          </div>

          {/* JC Tribute — old logo lives here per Tessa */}
          <div className="jc-tribute">
            <div className="jc-logo">
              <img src={citcLogoIcon} alt="CITC legacy logo" className="jc-logo-img" />
            </div>
            <div className="jc-text">
              <p className="eyebrow">Club Legacy</p>
              <h3 className="jc-title">Coach John Cannon</h3>
              <p className="jc-body">
                Calgary International Track Club was founded on Coach John Cannon's vision
                to create an environment where dedicated athletes could maximize their
                potential and pursue excellence both on and off the track. Under his
                leadership — one of Canada's most decorated track and field coaches, with
                international appointments spanning four Olympic Games — CITC established
                a legacy defined not only by medals, but by integrity, character, and
                community. His influence remains the foundation of everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-inner">
          <p className="cta-eyebrow">Join the Club</p>
          <h2 className="cta-title">Start Your<br />Free Trial</h2>
          <p className="cta-sub">
            New athletes are invited to experience CITC's training environment, coaching
            style, and team culture through our 2-week trial. A valid Athletics Alberta
            membership is required before your first session.
          </p>
          <div className="cta-btns">
            <button className="btn-primary" onClick={() => setIsRegModalOpen(true)}>Register Now</button>
            <Link to="/contact" className="btn-outline-dark">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-badge">CITC</span>
            <p className="footer-tag">
              Calgary International Track Club<br />
              In the Habit of Excellence since 1993
            </p>
          </div>
          <div className="footer-links">
            <Link to="/the-club/coaches">Coaches</Link>
            <Link to="/the-club/training">Programs</Link>
            <Link to="/membership/fees">Membership</Link>
            <Link to="/contact">Contact</Link>
            <a href="https://www.instagram.com/calgaryinternationaltrackclub/" target="_blank" rel="noreferrer">Instagram</a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Calgary International Track Club. All rights reserved.</p>
        </div>
      </footer>

    </main>
  );
}
