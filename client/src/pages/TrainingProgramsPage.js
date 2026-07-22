import { useState, useEffect } from 'react';
import './TrainingProgramsPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PROGRAM_STRUCTURE_POINTS = [
  'Speed development',
  'Strength and athleticism',
  'Movement quality',
  'Long-term athlete development',
];

export default function TrainingProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/programs`)
      .then(res => res.json())
      .then(data => setPrograms(data.programs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="training-page">
      <div className="training-hero">
        <span className="training-eyebrow">THE CLUB</span>
        <h1 className="training-title">Training Programs</h1>
        <p className="training-subtitle">
          Our training model is built around the development of complete athletes.
        </p>
      </div>

      <div className="training-structure-card">
        <h2>Program Structure</h2>
        <p>
          All event groups share a common foundation. Athletes are placed in programs based
          on event demands, while progression across groups is encouraged as athletes mature
          and specialize.
        </p>
        <ul className="training-structure-list">
          {PROGRAM_STRUCTURE_POINTS.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </div>

      {loading ? (
        <p className="admin-cms-empty">Loading...</p>
      ) : programs.length === 0 ? (
        <p className="admin-cms-empty">No programs added yet.</p>
      ) : (
        <div className="training-programs-list">
          {programs.map((prog) => (
            <div className="training-program-card" key={prog.id}>
              {prog.imageUrl && <img src={prog.imageUrl} alt={prog.name} className="training-program-img" />}
              <h2>{prog.name}</h2>
              {prog.ageGroup && <p className="training-program-agegroup">{prog.ageGroup}</p>}
              <div className="rtf-content" dangerouslySetInnerHTML={{ __html: prog.description }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
