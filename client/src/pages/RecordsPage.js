import './StaticPage.css';

export default function RecordsPage() {
  return (
    <div className="static-page">
      <div className="static-hero">
        <span className="static-eyebrow">NEWS &amp; UPDATES</span>
        <h1 className="static-title">Club Records</h1>
      </div>

      <div className="static-card">
        <h2>Keon — Alberta Records</h2>

        <div className="records-table-wrap">
          <p className="records-event-heading">60m Hurdles</p>
          <table className="records-table">
            <tbody>
              <tr><td>U15</td><td className="records-mark">8.52</td></tr>
              <tr><td>U16</td><td className="records-mark">8.08</td></tr>
              <tr><td>U17</td><td className="records-mark">7.77 <span className="records-canadian-tag">Canadian Record</span></td></tr>
              <tr><td>U18</td><td className="records-mark">7.86</td></tr>
              <tr><td>U19</td><td className="records-mark">7.86</td></tr>
              <tr><td>U23</td><td className="records-mark">7.75 <span className="records-canadian-tag">Canadian Record</span></td></tr>
              <tr><td>Open</td><td className="records-mark">7.85</td></tr>
            </tbody>
          </table>

          <p className="records-event-heading">110m Hurdles</p>
          <table className="records-table">
            <tbody>
              <tr><td>U16 (36")</td><td className="records-mark">14.42</td></tr>
              <tr><td>U19 (39")</td><td className="records-mark">13.84</td></tr>
              <tr><td>U20 (42")</td><td className="records-mark">14.19</td></tr>
            </tbody>
          </table>

          <p className="records-event-heading">100m Sprint</p>
          <table className="records-table">
            <tbody>
              <tr><td>U19</td><td className="records-mark">10.43</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="static-note">
        More club records coming soon — check back for updates.
      </p>
    </div>
  );
}
