import { useState, useEffect } from 'react';
import './CodeOfConductPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CONDUCT_POINTS = [
  'Fall outdoor training begins at 5pm. This means that a warmup begins at 5pm. If you are unable to attend a session, please give notice.',
  "On competition day, please arrive at the venue 1.5 hours before the first race. If you are unable to attend, please give as much notice as possible. Race entries are a big cost to the team, and if you miss a race, you will be required to pay the fee.",
  'When travelling with CITC, please respect the schedules of others. Departure times are strict. Contact someone if you are delayed.',
  'Respect your teammates. There is a zero-tolerance policy for stealing and bullying. You will be asked to find a new training group. If you feel that you are not being respected, it is asked that you speak in confidentiality to the coaches.',
  'Respect the training and competition venues: any mess made is yours to clean. The MNP Community and Sports Centre has a strict attire policy (shirts on, shoes on), and any equipment used is yours to put away properly. The Glenmore track equipment is shared by multiple groups, and follows an honour system; if you break an item, please simply notify a coach!',
  "Respect your coaches and teammates. Please note that they don't expect a habit of perfection, but a habit of excellence; by showing up to the track ready to go, you are giving them the respect they deserve. Additionally, please pay your team fees as soon as possible.",
  'Respect your sponsors. Each track meet is hosted by Calgary Track Council, Athletics Alberta, Athletics Canada, or other international committees. The reputation of CITC is governed by the quality of your interactions with these bodies. Please thank race officials, volunteers, and directors at competitions.',
  'Respect your opponents. Shake hands after racing, and please speak respectfully to competitors.',
  "When representing CITC, there is a zero tolerance for alcohol, narcotics, marijuana, weapons, and abuse (physical, emotional, mental). This is not a CITC-specific rule; this rule is in accordance with the IAAF's anti-doping and anti-violence rules.",
];

export default function CodeOfConductPage() {
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/api/site-content`)
      .then(res => res.json())
      .then(data => setSiteContent(data.content || {}))
      .catch(() => {});
  }, []);

  const fullOverride = siteContent.code_of_conduct_full || null;

  return (
    <div className="conduct-page">
      <div className="conduct-hero">
        <span className="conduct-eyebrow">THE CLUB</span>
        <h1 className="conduct-title">Code of Conduct</h1>
      </div>

      <div className="conduct-card">
        {fullOverride ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{fullOverride}</div>
        ) : (
          <>
            <h2>Dear Athlete,</h2>
            <p>
              Whether you are a high school, university, or post-collegiate athlete, your
              dedication to individual progress in sport and life is encouraged and supported by
              Calgary International Track Club (CITC).
            </p>
            <p>
              In turn, it is requested that you support the name and reputation of CITC; Calgary
              International has always been considered an elite Canadian track club with a strong
              commitment to the habit of excellence. It is no easy task to embody this mission, but
              it's a worthy endeavour.
            </p>
            <p>
              A CITC Code of Conduct has been created to guide you in this mission of excellence.
              These policies are not intended to be threatening or demanding; rather, they're
              designed so that you, a CITC athlete, may train in a healthy, safe, high-functioning
              environment. This Code of Conduct is meant to serve you, so that you can flourish
              with full comprehension of team values.
            </p>
            <p>
              If you've registered with Athletics Alberta under a CITC affiliation, then you have
              agreed to follow this Code of Conduct. If you do not believe that you can commit to
              this Code, CITC coaches would be happy to refer you to another group.
            </p>
            <p>
              The protocol is simple but strict, with respect a priority. If, at any point, you feel
              that a fellow athlete is not respecting the outlined policies, please speak to the
              coaches in confidence.
            </p>

            <h3>Please read over the following, and reach out to coaches for clarification as necessary:</h3>
            <ol className="conduct-list">
              {CONDUCT_POINTS.map((point, i) => <li key={i}>{point}</li>)}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
