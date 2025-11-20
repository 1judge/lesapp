export function LiveIndicator() {
  return <span className="inline-flex items-center text-xs text-[var(--live)]">
    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--live)] animate-pulse" />LIVE
  </span>;
}
