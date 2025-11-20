export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-md border border-[var(--border)] px-2 py-1 text-xs ${className}`}>{children}</span>;
}
