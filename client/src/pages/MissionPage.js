import './MissionPage.css';

const SELECTED_STATEMENT =
  "In the habit of excellence—developing champions in sport and leaders in life.";

// eslint-disable-next-line no-unused-vars
const ALL_OPTIONS = [
  {
    label: 'Excellence-Focused',
    text: 'To develop disciplined, high-performing athletes by fostering a culture of teamwork, integrity, and competitive excellence—on and off the track.',
  },
  {
    label: 'Access & Opportunity Focused',
    text: 'To make high-performance track and field accessible to athletes of all backgrounds, empowering them to pursue excellence through expert coaching, character development, and opportunity.',
  },
  {
    label: 'Athlete Development Focused',
    text: "To maximize every athlete's potential through structured training, mentorship, and a commitment to personal growth, sportsmanship, and lifelong success.",
  },
  {
    label: 'Community & Legacy Focused',
    text: 'To build a legacy of excellence in Canadian athletics by developing principled competitors, strengthening community partnerships, and inspiring the next generation of track and field athletes.',
  },
  {
    label: 'Short & Powerful',
    text: 'In the habit of excellence—developing champions in sport and leaders in life.',
  },
];

const DEI_PARAGRAPHS = [
  "Our track and field program is committed to creating an environment where every athlete feels valued, respected, and supported in reaching their full potential.",
  "We believe that diversity strengthens our team. We welcome athletes of all backgrounds, identities, and experiences, and recognize that each individual brings unique strengths that contribute to our collective success.",
  "We are dedicated to equity by ensuring fair access to coaching, training resources, competition opportunities, and support systems. We understand that athletes have different needs, and we strive to provide the appropriate support so that everyone has the opportunity to succeed.",
  "We foster inclusion by building a team culture grounded in respect, trust, and accountability. We do not tolerate discrimination, harassment, or exclusion of any kind. Every athlete deserves to feel safe, heard, and empowered.",
];

const DEI_COMMITMENTS = [
  'Promoting respect and sportsmanship in all interactions',
  'Supporting one another on and off the track',
  'Listening to and learning from different perspectives',
  'Addressing barriers that may limit participation or performance',
  'Continuously improving our culture through education and open dialogue',
];

export default function MissionPage() {
  return (
    <div className="mission-page">
      <div className="mission-hero">
        <span className="mission-eyebrow">THE CLUB</span>
        <h1 className="mission-title">Our Mission</h1>
      </div>

      <div className="mission-statement-card">
        <p className="mission-statement-text">"{SELECTED_STATEMENT}"</p>
      </div>

      <div className="mission-card">
        <h2>Our Commitment to Diversity, Equity &amp; Inclusion</h2>
        {DEI_PARAGRAPHS.map((p, i) => <p key={i}>{p}</p>)}

        <h3>As a team, we commit to:</h3>
        <ul>
          {DEI_COMMITMENTS.map((c, i) => <li key={i}>{c}</li>)}
        </ul>

        <p className="mission-closing">
          Together, we strive to build not only faster athletes, but a stronger, more
          inclusive team community.
        </p>
      </div>
    </div>
  );
}
