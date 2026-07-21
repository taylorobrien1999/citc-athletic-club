import { useState, useEffect } from 'react';
import './StaticPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/records`)
      .then(res => res.json())
      .then(data => setRecords(data.records || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Group records by athlete, then by event, for a clean readable layout
  const byAthlete = records.reduce((acc, r) => {
    acc[r.athleteName] = acc[r.athleteName] || {};
    acc[r.athleteName][r.event] = acc[r.athleteName][r.event] || [];
    acc[r.athleteName][r.event].push(r);
    return acc;
  }, {});

  return (
    <div className="static-page">
      <div className="static-hero">
        <span className="static-eyebrow">NEWS &amp; UPDATES</span>
        <h1 className="static-title">Club Records</h1>
      </div>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : Object.keys(byAthlete).length === 0 ? (
        <div className="static-card">
          <p>No club records added yet — check back soon.</p>
        </div>
      ) : (
        Object.entries(byAthlete).map(([athlete, events]) => (
          <div className="static-card" key={athlete} style={{ marginBottom: 24 }}>
            <h2>{athlete} — Alberta Records</h2>
            <div className="records-table-wrap">
              {Object.entries(events).map(([eventName, marks]) => (
                <div key={eventName}>
                  <p className="records-event-heading">{eventName}</p>
                  <table className="records-table">
                    <tbody>
                      {marks.map((m) => (
                        <tr key={m.id}>
                          <td>{m.category}</td>
                          <td className="records-mark">
                            {m.mark}
                            {m.note && <span className="records-canadian-tag">{m.note}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <p className="static-note">
        More club records coming soon — check back for updates.
      </p>
    </div>
  );
}
