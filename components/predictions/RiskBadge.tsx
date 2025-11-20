export function RiskBadge({ level }: { level: 'low'|'medium'|'high' }) {
  const color = level === 'low' ? 'var(--success)' : level === 'medium' ? 'var(--warning)' : 'var(--danger)';
  return (
    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs border" style={{ borderColor: color, color }}>
      Risk: {level}
    </span>
  );
}
