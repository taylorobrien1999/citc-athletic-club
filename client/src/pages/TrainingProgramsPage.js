import { useState, useEffect } from 'react';
import ClosingCTA from '../components/ClosingCTA';
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
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/programs`)
      .then(res => res.json())
      .then(data => setPrograms(data.programs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const goTo = (index) => {
    setCurrent(index);
    setExpanded(false); // collapse text again when switching programs
  };

  const goPrev = () => goTo((current - 1 + programs.length) % programs.length);
  const goNext = () => goTo((current + 1) % programs.length);

  const prog = programs[current];

  return (
    <>
      <div className="training-page">
        <div className="training-hero">
          <span className="training-eyebrow">THE CLUB</span>
          <h1 className="training-title">Training Programs</h1>
        </div>

        {loading ? (
          <p className="admin-cms-empty">Loading...</p>
        ) : programs.length === 0 ? (
          <p className="admin-cms-empty">No programs added yet.</p>
        ) : (
          <div className="training-carousel">
            <div className="training-program-card">
              {prog.imageUrl ? (
                <img src={prog.imageUrl} alt={prog.name} className="training-program-img" />
              ) : (
                <div className="training-program-card-noimg">{prog.name}</div>
              )}

              <div className="training-program-body">
                <h2>{prog.name}</h2>
                {prog.ageGroup && <p className="training-program-agegroup">{prog.ageGroup}</p>}

                <div className={`training-rtf-wrap${expanded ? ' expanded' : ''}`}>
                  <div className="rtf-content" dangerouslySetInnerHTML={{ __html: prog.description }} />
                </div>

                <button
                  className="training-expand-btn"
                  onClick={() => setExpanded(prev => !prev)}
                >
                  {expanded ? 'Show less ↑' : 'Read more ↓'}
                </button>
              </div>

              {/* Prev/Next arrows — hidden entirely if there's only one program */}
              {programs.length > 1 && (
                <>
                  <button className="training-arrow training-arrow-prev" onClick={goPrev} aria-label="Previous program">‹</button>
                  <button className="training-arrow training-arrow-next" onClick={goNext} aria-label="Next program">›</button>
                </>
              )}
            </div>

            {/* Dot indicators — same visual language as the Homepage hero slideshow */}
            {programs.length > 1 && (
              <div className="training-dots">
                {programs.map((_, i) => (
                  <button
                    key={i}
                    className={`training-dot${i === current ? ' active' : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Program ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

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
      </div>

      <ClosingCTA />
    </>
  );
}
