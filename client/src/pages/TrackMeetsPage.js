import './TrackMeetsPage.css';

const INDOOR_MEETS = [
  { name: 'Dino Meets', when: 'Dec / Jan' },
  { name: 'Alberta Indoor Games', when: 'Jan' },
  { name: 'Golden Bear', when: 'Feb' },
  { name: 'Indoor Provincials', when: 'March' },
  { name: 'Indoor Nationals', when: 'March' },
];

const OUTDOOR_MEETS = [
  { name: 'Spring Challenge', when: 'May' },
  { name: "Gord's Series", when: 'May / June' },
  { name: 'Caltaf', when: 'July' },
  { name: 'Sherwood Park', when: 'July' },
  { name: 'Nationals U20 / Senior', when: 'June (varies year to year)' },
  { name: 'Legion Nationals U16 / U18', when: 'August' },
];

export default function TrackMeetsPage() {
  return (
    <div className="meets-page">
      <div className="meets-hero">
        <span className="meets-eyebrow">THE CLUB</span>
        <h1 className="meets-title">Track Meets</h1>
        <p className="meets-subtitle">
          CITC athletes compete year-round across Alberta and nationally, indoors and out.
        </p>
      </div>

      <div className="meets-grid">
        <div className="meets-season-card">
          <h2>Indoor Season</h2>
          <table className="meets-table">
            <tbody>
              {INDOOR_MEETS.map((m) => (
                <tr key={m.name}>
                  <td>{m.name}</td>
                  <td className="meets-when">{m.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="meets-season-card">
          <h2>Outdoor Season</h2>
          <table className="meets-table">
            <tbody>
              {OUTDOOR_MEETS.map((m) => (
                <tr key={m.name}>
                  <td>{m.name}</td>
                  <td className="meets-when">{m.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="meets-note">
        Exact dates and venues are confirmed closer to each season — check Announcements or
        contact us for the latest schedule.
      </p>
    </div>
  );
}
