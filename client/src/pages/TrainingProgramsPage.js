import { useState, useEffect } from 'react';
import './TrainingProgramsPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PROGRAM_STRUCTURE_POINTS = [
  'Speed development',
  'Strength and athleticism',
  'Movement quality',
  'Long-term athlete development',
];

const PROGRAMS = [
  {
    title: 'Sprint Program',
    slug: 'sprint',
    intro: "The Sprint program develops athletes for events requiring maximum speed, power, and technical precision. Training prioritizes acceleration, maximal velocity development, and neuromuscular efficiency while building the strength and coordination necessary for elite sprint performance.",
    focusHeading: 'Athletes focus on:',
    focus: [
      'Acceleration and speed development',
      'Sprint mechanics and movement efficiency',
      'Strength, power, and elastic reactivity',
      'Speed endurance and race modeling',
      'Competition execution and performance consistency',
    ],
    closing: 'The objective is to produce fast, resilient athletes capable of sustaining high performance across multiple seasons while minimizing injury risk.',
  },
  {
    title: 'Hurdles Program',
    slug: 'hurdles',
    intro: 'The Hurdles program combines sprint speed with rhythm, coordination, and technical mastery. Hurdlers are developed as complete speed athletes, emphasizing efficient movement patterns and consistent stride rhythm under race conditions.',
    focusHeading: 'Training includes:',
    focus: [
      'Sprint development and acceleration mechanics',
      'Technical hurdle skill progression',
      'Rhythm and stride pattern development',
      'Strength, mobility, and elastic stability',
      'Race modeling for sprint and long hurdles',
    ],
    closing: "Rather than viewing rhythm and technique as the primary drivers of hurdle success, our philosophy recognizes that speed is the foundation upon which all hurdling qualities are built. Athletes are developed as sprinters first — hurdlers second.",
  },
  {
    title: 'Middle Distance Program',
    slug: 'middledistance',
    intro: 'The Middle Distance program develops athletes for events where speed, strength, and endurance intersect. Program emphasis is placed on the 600m, 800m, 1000m, and 1500m, where athletes learn to integrate sprint mechanics, aerobic support, and tactical racing ability within a unified performance model.',
    focusHeading: 'Training emphasizes:',
    focus: [
      'Maximum velocity development and anaerobic speed reserve',
      'Strength, power, and elastic athleticism',
      'Efficient mechanics and movement quality',
      'Race-specific energy system development for 600m–1500m, extending to the 3000m for interested athletes',
      'Tactical awareness, pacing strategy, and competitive decision-making',
      'Progressive introduction to the Steeplechase for interested athletes',
    ],
    closing: 'Cross country is viewed primarily as a developmental base season, used to build aerobic capacity, resilience, and competitive experience in support of track performance. The objective is the development of complete middle distance athletes — fast, durable, and tactically intelligent competitors.',
  },
];

const STRENGTH_POINTS = [
  'Development of maximal strength and force production',
  'Power and rate of force development',
  'Elastic stiffness and injury resilience',
  'Postural control, movement efficiency and all-around athleticism',
];

export default function TrainingProgramsPage() {
  const [additionalPrograms, setAdditionalPrograms] = useState([]);
  const [loadingExtra, setLoadingExtra] = useState(true);
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/programs`);
        const data = await res.json();
        if (res.ok) setAdditionalPrograms(data.programs);
      } catch (err) {
        // Fail silently — this section is a bonus add-on, not core content
      } finally {
        setLoadingExtra(false);
      }
    };
    load();
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

      <div className="training-programs-list">
        {PROGRAMS.map((prog) => {
          const photoOverride = siteContent[`training_${prog.slug}_image`];
          const textOverride = siteContent[`training_${prog.slug}_text`];
          const titleOverride = siteContent[`training_${prog.slug}_title`];
          return (
            <div className="training-program-card" key={prog.title}>
              {photoOverride && <img src={photoOverride} alt={prog.title} className="training-program-img" />}
              <h2>{titleOverride || prog.title}</h2>
              {textOverride ? (
                <div style={{ whiteSpace: 'pre-wrap' }}>{textOverride}</div>
              ) : (
                <>
                  <p>{prog.intro}</p>
                  <h3>{prog.focusHeading}</h3>
                  <ul>
                    {prog.focus.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                  <p className="training-program-closing">{prog.closing}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="training-program-card">
        {siteContent.training_strength_image && (
          <img src={siteContent.training_strength_image} alt="Strength & Weight Training" className="training-program-img" />
        )}
        <h2>{siteContent.training_strength_title || 'Strength & Weight Training'}</h2>
        {siteContent.training_strength_text ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{siteContent.training_strength_text}</div>
        ) : (
          <>
            <p>
              Strength training is a foundational component of the Calgary International Track
              Club development model. Across all event groups, athletes participate in structured
              weight training designed to enhance speed, power, durability, and long-term athletic
              development. Performance on the track is supported by the physical qualities
              developed off the track.
            </p>
            <h3>Strength programming emphasizes:</h3>
            <ul>
              {STRENGTH_POINTS.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
            <p className="training-program-closing">
              Weight training supports all CITC programs — Sprint, Hurdles, and Middle Distance —
              reinforcing our commitment to developing complete athletes capable of sustaining
              high performance over time.
            </p>
          </>
        )}
      </div>

      {!loadingExtra && additionalPrograms.length > 0 && (
        <div className="training-programs-list">
          <h2 className="training-additional-heading">Additional Programs</h2>
          {additionalPrograms.map((prog) => (
            <div className="training-program-card" key={prog.id}>
              {prog.imageUrl && <img src={prog.imageUrl} alt={prog.name} className="training-program-img" />}
              <h2>{prog.name}</h2>
              {prog.ageGroup && <p className="training-program-agegroup">{prog.ageGroup}</p>}
              <p>{prog.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}