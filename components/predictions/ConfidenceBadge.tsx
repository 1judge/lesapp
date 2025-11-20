export function ConfidenceBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center rounded-md bg-[var(--surface-hover)] px-2 py-1 text-xs text-white border border-[var(--border)]">
      Confidence: <b className="ml-1 text-[var(--primary)]">{value}%</b>
    </span>
  );
}
