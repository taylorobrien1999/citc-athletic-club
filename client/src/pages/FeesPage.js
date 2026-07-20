import './StaticPage.css';

export default function FeesPage() {
  return (
    <div className="static-page">
      <div className="static-hero">
        <span className="static-eyebrow">MEMBERSHIP</span>
        <h1 className="static-title">Fees</h1>
      </div>

      <div className="static-card">
        <p>
          For current program fees and registration details, please contact us directly —
          we're happy to provide information and discuss the best training option for you.
        </p>
        <a href="mailto:CalgaryInternationalTrackClub@gmail.com" className="static-email-cta">
          CalgaryInternationalTrackClub@gmail.com
        </a>
      </div>
    </div>
  );
}
