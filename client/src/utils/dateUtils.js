// Parses a DATEONLY string (e.g. "2026-07-25") as a LOCAL date instead of
// UTC midnight. `new Date("2026-07-25")` is parsed as UTC per the JS spec,
// which shifts backward into the previous day for anyone west of UTC (like
// Calgary) — causing near-term events to incorrectly fail an "is this
// upcoming?" comparison, showing 0 results even when events genuinely exist.
export function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}
