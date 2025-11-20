"use client";
import { useLiveScores } from '@/hooks/useLiveScores';

export default function LivePage() {
  const { data, isLoading } = useLiveScores(true);
  return (
    <div className="space-y-4">
      <h1 className="text-h1 font-semibold">Live Scores</h1>
      {isLoading && <div>Loading live matches…</div>}
      {!isLoading && (!data || data.length === 0) && <div className="text-[var(--text-secondary)]">No live matches right now. Showing today’s fixtures instead soon.</div>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((fx: any) => (
          <a key={fx.fixture.id} href={`/match/${fx.fixture.id}`} className="card p-4 hover:bg-[var(--surface-hover)] transition">
            <div className="text-xs text-[var(--text-secondary)]">{fx.league?.name}</div>
            <div className="mt-2 flex items-center justify-between text-white">
              <div className="font-semibold">{fx.teams.home.name}</div>
              <div className="text-[var(--live)] font-bold">{fx.goals?.home ?? 0} - {fx.goals?.away ?? 0}</div>
              <div className="font-semibold">{fx.teams.away.name}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
