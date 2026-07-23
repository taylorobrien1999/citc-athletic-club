import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import citcLogoFull from '../assets/citc-logo-full.png';
import citcLogoIcon from '../assets/citc-logo-icon.jpg';
import RegistrationModal from '../components/RegistrationModal';
import './HomePage.css';

// ── Programs
const PROGRAMS = [
  {
    tag: 'Program',
    title: 'Sprint & Speed',
    slug: 'sprint',
    img: '/citc-images/prog-sprint.jpg',
    desc: 'Maximum speed, power, and technical precision. Training prioritizes acceleration mechanics, maximal velocity development, and neuromuscular efficiency.',
  },
  {
    tag: 'Program',
    title: 'Hurdles',
    slug: 'hurdles',
    img: '/citc-images/prog-hurdles.jpg',
    desc: 'Sprint speed combined with rhythm, coordination, and technical mastery. Athletes are developed as sprinters first — hurdlers second.',
  },
  {
    tag: 'Program',
    title: 'Middle Distance',
    slug: 'middledistance',
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
  const [siteContent, setSiteContent] = useState({});
  const [teamCoaches, setTeamCoaches] = useState([]);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {}); // fail silently — defaults still render
  }, []);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    fetch(`${API_URL}/api/team-coaches`)
      .then(res => res.json())
      .then(data => setTeamCoaches(data.coaches || []))
      .catch(() => {});
  }, []);

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
          {SLIDES.map((src, i) => {
            const override = siteContent[`hero_image_${i + 1}`];
            return (
              <div key={src} className={`slide${i === slide ? ' active' : ''}`}>
                <img src={override || src} alt="" aria-hidden="true" />
              </div>
            );
          })}
        </div>

        <div className="hero-overlay" />

        <div className="hero-body">
          <div className="hero-content-wrap">
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
            {siteContent.home_hero_subtext ? (
              <p className="hero-sub" dangerouslySetInnerHTML={{ __html: siteContent.home_hero_subtext }} />
            ) : (
              <p className="hero-sub">
                A values driven track club since 1993. Developing high-performance athletes and champions in life across Calgary and beyond.
              </p>
            )}
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
            {siteContent.home_about_text ? (
              <div className="rtf-content" dangerouslySetInnerHTML={{ __html: siteContent.home_about_text }} />
            ) : (
              <>
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
              </>
            )}
            <Link to="/the-club/mission" className="text-link">Our Mission & Values →</Link>
          </div>
          <div className="about-image-wrap">
            <img src={siteContent.home_about_image || "/citc-images/about.jpg"} alt="CITC athletes — team camaraderie" />
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
              <Link to="/the-club/training" className="prog-card" key={p.title}>
                <div className="prog-img-wrap">
                  <span className="prog-tag">{p.tag}</span>
                  <img src={siteContent[`home_program_${p.slug}_image`] || p.img} alt={p.title} />
                </div>
                <div className="prog-body">
                  <div className="prog-title">{p.title}</div>
                  <p className="prog-desc">{p.desc}</p>
                  <span className="prog-link">Learn more →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="programs-view-all">
            <Link to="/the-club/training" className="btn-outline">View All Programs →</Link>
          </div>
        </div>
      </section>

      {/* ── COACHES ──────────────────────────────────────────────────────── */}
      <section className="coaches-section">
        <div className="coaches-inner">
          <p className="eyebrow">Coaching Staff</p>
          <h2 className="section-title">World-Class Coaches.<br />Personal Development.</h2>
          <div className="coaches-grid">
            {teamCoaches.map((c) => (
              <Link to="/the-club/coaches" className="coach-card" key={c.id}>
                {c.photoUrl ? (
                  <img src={c.photoUrl} alt={c.name} className="coach-av coach-av-photo" />
                ) : (
                  <div className="coach-av">
                    {c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="coach-name">{c.name}</div>
                <div className="coach-role">{c.role || 'Coach'}</div>
                <p className="coach-detail">{c.homepageSummary}</p>
              </Link>
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
              {siteContent.jc_tribute_text ? (
                <div className="jc-body rtf-content" dangerouslySetInnerHTML={{ __html: siteContent.jc_tribute_text }} />
              ) : (
                <p className="jc-body">
                  CITC was founded on Coach John Cannon's vision to create an environment where
                  dedicated athletes could maximize their potential and pursue excellence both on
                  and off the track. One of Canada's most decorated track and field coaches, with
                  international appointments spanning four Olympic Games, his legacy is defined not
                  only by medals, but by integrity, character, and community — values that continue
                  to guide CITC today.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-inner">
          <p className="cta-eyebrow">Join the Club</p>
          <h2 className="cta-title">
            {siteContent.home_cta_title
              ? <span dangerouslySetInnerHTML={{ __html: siteContent.home_cta_title.replace(/\n/g, '<br />') }} />
              : <>Start Your<br />Journey</>
            }
          </h2>
          <p className="cta-sub">
            {siteContent.home_cta_sub || (
              <>
                New athletes and parents are invited to submit a Registration Inquiry — a coach
                will follow up within 48 hours to discuss the best training option for you. A
                valid Athletics Alberta membership is required before your first session.
              </>
            )}
          </p>
          <div className="cta-btns">
            <button className="btn-primary" onClick={() => setIsRegModalOpen(true)}>Register Now</button>
            <Link to="/contact" className="btn-outline-dark">Contact Us</Link>
          </div>
        </div>
      </section>

    </main>
  );
}