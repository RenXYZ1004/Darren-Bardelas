/**
 * Deterministic gradient stand-in used wherever a real photo has not been
 * added yet — keeps the layout intact instead of rendering a broken image.
 */
const PALETTES = [
  ['#0b2b33', '#123f4d'],
  ['#1a1030', '#2b1a4d'],
  ['#2b1220', '#4d1f33'],
  ['#0f2418', '#1a3d29'],
  ['#231a08', '#3d2f12'],
];

function hashCode(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function Placeholder({ label, seed = 'default', className = '' }) {
  const [from, to] = PALETTES[hashCode(seed) % PALETTES.length];
  const initials = (label || '?')
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`placeholder-visual ${className}`.trim()}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      role="img"
      aria-label={`${label} — placeholder image`}
    >
      <span aria-hidden="true">{initials}</span>
    </div>
  );
}
