import './StaticPage.css';

export default function AthleticsAlbertaPage() {
  return (
    <div className="static-page">
      <div className="static-hero">
        <span className="static-eyebrow">MEMBERSHIP</span>
        <h1 className="static-title">Athletics Alberta</h1>
      </div>

      <div className="static-card">
        <p>
          A valid Athletics Alberta (AA) membership is required for all athletes training with
          Calgary International Track Club. This membership ensures athletes are properly
          registered, insured, and eligible to compete in sanctioned events throughout the
          season.
        </p>
        <p>
          If you are unsure which type of registration is appropriate for you or your athlete,
          please reach out to us and we would be happy to assist.
        </p>
        <p>
          Learn more or register through Athletics Alberta:<br />
          <a
            href="https://athleticsreg.ca/#!/memberships/athletics-alberta-2026-membership"
            target="_blank"
            rel="noreferrer"
          >
            athleticsreg.ca — Athletics Alberta 2026 Membership
          </a>
        </p>
      </div>
    </div>
  );
}
