interface Props { value: number; color?: string; label: string }
export function ProbabilityBar({ value, color = 'var(--primary)', label }: Props) {
  return (
    <div>
      <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 w-full rounded bg-[var(--surface-hover)]">
        <div className="h-2 rounded" style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color, transition: 'width 400ms ease' }} />
      </div>
    </div>
  );
}
