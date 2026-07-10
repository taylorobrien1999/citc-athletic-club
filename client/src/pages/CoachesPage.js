import citcLogoIcon from '../assets/citc-logo-icon.jpg';
import './CoachesPage.css';

const COACHES = [
  {
    initials: 'TG',
    name: 'Tessa Gray-Burnett',
    role: 'Coach',
    bio: [
      "Tessa Gray-Burnett was born and raised in Calgary, Alberta, where she developed a lifelong passion for sport and the outdoors. She pursued a degree in Kinesiology at the University of Calgary and currently works as a personal trainer and strength coach.",
      "Tessa competed in track and field for 17 years, specializing in the 400m hurdles, representing Alberta and Canada at the Western Canada Summer Games (2003) and Canada Summer Games (2005), and competing at the Senior Canadian Championships seven times, placing 4th nationally in 2007, 2008, and 2011.",
      "While competing for the University of Calgary Dinos, she earned multiple All-Canadian honors, several Canada West team championships, and served as team captain for three years.",
      "Since retiring from competition in 2013, Tessa has coached youth, provincial, and national-level athletes with Calgary International Track Club, focusing on speed development, technical skill, and athlete confidence.",
    ],
    qualifications: [
      'Bachelor of Kinesiology (Pedagogy Major), University of Calgary',
      'Certified Strength and Conditioning Specialist (CSCS)',
      'NCCP Certified Athletics Performance Track and Field Coach',
      'NCCP Trained Olympic Weightlifting Coach',
      'Ki-Hara Level 2 Resistance Stretching Practitioner',
      'Precision Nutrition Level 1 Certified Coach (Pn1)',
    ],
  },
  {
    initials: 'DM',
    name: 'Dani Marland',
    role: 'Coach',
    bio: [
      "I coach because I genuinely love it. I enjoy working with athletes and helping individuals reach their full potential both on and off the track. I strongly believe in the power of sport to shape an individual's character for life — teaching discipline, resilience, teamwork, and accountability that extend far beyond competition.",
      "The values that guide my coaching are hard work, teamwork, respect, honesty, and accountability. Although track and field is often viewed as an individual sport, I place a strong emphasis on teamwork, creating an environment where athletes support and push each other to improve.",
      "My coaching approach is built around a speed-first philosophy, with a strong emphasis on proper running mechanics and technical execution. In sprinting and hurdling especially, small technical improvements can make a significant difference in performance.",
      "Success for me isn't only measured by wins or results, but by the growth of my athletes as both competitors and individuals.",
    ],
    qualifications: [],
  },
  {
    initials: 'NI',
    name: 'Nicole',
    role: 'Coach',
    bio: [
      "Nicole brings energy and expertise across all event groups, contributing to CITC's culture of excellence, discipline, and athlete development.",
    ],
    qualifications: [],
  },
];

export default function CoachesPage() {
  return (
    <div className="coaches-page">
      <div className="coaches-page-hero">
        <span className="coaches-eyebrow">THE CLUB</span>
        <h1 className="coaches-title">Meet the Coaches</h1>
        <p className="coaches-subtitle">
          World-class coaching, personal development, and a shared commitment to
          the habit of excellence.
        </p>
      </div>

      <div className="coaches-list">
        {COACHES.map((c) => (
          <div className="coach-full-card" key={c.name}>
            <div className="coach-full-header">
              <div className="coach-full-av">{c.initials}</div>
              <div>
                <h2 className="coach-full-name">{c.name}</h2>
                <p className="coach-full-role">{c.role}</p>
              </div>
            </div>

            <div className="coach-full-bio">
              {c.bio.map((para, i) => <p key={i}>{para}</p>)}
            </div>

            {c.qualifications.length > 0 && (
              <div className="coach-qualifications">
                <h3>Qualifications</h3>
                <ul>
                  {c.qualifications.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* JC Tribute — old logo lives here per Tessa's request */}
      <div className="coaches-jc-tribute">
        <div className="jc-logo">
          <img src={citcLogoIcon} alt="CITC legacy logo" className="jc-logo-img" />
        </div>
        <div className="jc-text">
          <p className="eyebrow">Club Legacy</p>
          <h3 className="jc-title">Coach John Cannon</h3>
          <p>
            CITC was founded on Coach John Cannon's vision to create an environment where
            dedicated athletes could maximize their potential and pursue excellence both on
            and off the track. One of Canada's most decorated track and field coaches, with
            international appointments spanning four Olympic Games, his legacy is defined not
            only by medals, but by integrity, character, and community — values that continue
            to guide CITC today.
          </p>
        </div>
      </div>
    </div>
  );
}