import './AuthBackground.css';

/**
 * Animated day/night track-field background used behind the sign in,
 * forgot password, reset password, and create account cards.
 *
 * Purely decorative -- aria-hidden so screen readers skip it. Respects
 * prefers-reduced-motion (see AuthBackground.css) and swaps automatically
 * with the site's [data-theme="dark"] attribute on <html>.
 *
 * Track ellipse radii below are ~10% larger than the original design
 * (rx 330/290/250/210, ry 110/93/76/60) -- to revert just the track size
 * while keeping everything else, restore those four rx/ry pairs and the
 * finish-line y1/y2 back to 160/380.
 */
export default function AuthBackground() {
  return (
    <div className="auth-bg" aria-hidden="true">
      <div className="auth-bg-sky" />

      <div className="auth-bg-sun" />
      <div className="auth-bg-moon" />

      <div className="auth-bg-cloud auth-bg-cloud--1" />
      <div className="auth-bg-cloud auth-bg-cloud--2" />
      <div className="auth-bg-cloud auth-bg-cloud--3" />
      <div className="auth-bg-cloud auth-bg-cloud--4" />
      <div className="auth-bg-cloud auth-bg-cloud--5" />
      <div className="auth-bg-cloud auth-bg-cloud--6" />
      <div className="auth-bg-cloud auth-bg-cloud--7" />
      <div className="auth-bg-cloud auth-bg-cloud--8" />

      <div className="auth-bg-star auth-bg-star--1" />
      <div className="auth-bg-star auth-bg-star--2" />
      <div className="auth-bg-star auth-bg-star--3" />
      <div className="auth-bg-star auth-bg-star--4" />
      <div className="auth-bg-star auth-bg-star--5" />
      <div className="auth-bg-star auth-bg-star--6" />
      <div className="auth-bg-star auth-bg-star--7" />
      <div className="auth-bg-star auth-bg-star--8" />
      <div className="auth-bg-star auth-bg-star--9" />
      <div className="auth-bg-star auth-bg-star--10" />
      <div className="auth-bg-star auth-bg-star--11" />
      <div className="auth-bg-star auth-bg-star--13" />
      <div className="auth-bg-star auth-bg-star--14" />
      <div className="auth-bg-star auth-bg-star--15" />
      <div className="auth-bg-star auth-bg-star--16" />
      <div className="auth-bg-star auth-bg-star--18" />
      <div className="auth-bg-star auth-bg-star--19" />
      <div className="auth-bg-star auth-bg-star--21" />
      <div className="auth-bg-star auth-bg-star--22" />
      <div className="auth-bg-star auth-bg-star--23" />
      <div className="auth-bg-star auth-bg-star--24" />
      <div className="auth-bg-star auth-bg-star--25" />
      <div className="auth-bg-star auth-bg-star--26" />
      <div className="auth-bg-star auth-bg-star--27" />
      <div className="auth-bg-star auth-bg-star--28" />
      <div className="auth-bg-star auth-bg-star--29" />
      <div className="auth-bg-star auth-bg-star--30" />
      <div className="auth-bg-star auth-bg-star--31" />
      <div className="auth-bg-star auth-bg-star--32" />
      <div className="auth-bg-star auth-bg-star--33" />

      <div className="auth-bg-shooting-star auth-bg-shooting-star--1" />
      <div className="auth-bg-shooting-star auth-bg-shooting-star--2" />

      <svg
        className="auth-bg-track"
        viewBox="0 0 800 420"
        preserveAspectRatio="xMidYMax meet"
      >
        <ellipse cx="400" cy="270" rx="363" ry="121" className="auth-bg-lane auth-bg-lane--outer-fill" />
        <ellipse cx="400" cy="270" rx="363" ry="121" className="auth-bg-lane" />
        <ellipse cx="400" cy="270" rx="319" ry="102" className="auth-bg-lane" />
        <ellipse cx="400" cy="270" rx="275" ry="84"  className="auth-bg-lane" />
        <ellipse cx="400" cy="270" rx="231" ry="66"  className="auth-bg-infield" />

        <line x1="400" y1="149" x2="400" y2="391" className="auth-bg-finishline" />
      </svg>
    </div>
  );
}
