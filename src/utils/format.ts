const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd'];

/** Compact number formatting that behaves at tiny idle-game rates too. */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '∞';
  if (value < 0) return `-${formatNumber(-value)}`;
  if (value === 0) return '0';
  if (value < 1) return value < 0.01 ? value.toFixed(3) : value.toFixed(2);
  if (value < 1000) return value < 10 ? trimZero(value.toFixed(2)) : Math.floor(value).toString();

  const tier = Math.min(Math.floor(Math.log10(value) / 3), SUFFIXES.length - 1);
  const scaled = value / Math.pow(1000, tier);
  return `${trimZero(scaled.toFixed(scaled < 10 ? 2 : 1))}${SUFFIXES[tier]}`;
}

function trimZero(text: string): string {
  return text.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

/** Rates keep a little more precision so "+0.2/s" does not become "+0/s". */
export function formatRate(value: number): string {
  if (value > 0 && value < 0.01) return '<0.01';
  if (value > 0 && value < 100) return trimZero(value.toFixed(2));
  return formatNumber(value);
}

export function formatTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}
