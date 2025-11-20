"use client";
import { useQuery } from '@tanstack/react-query';

async function fetchUpcoming() {
  const res = await fetch('/api/fixtures/upcoming');
  if (!res.ok) throw new Error('Failed to load upcoming fixtures');
  return res.json();
}

export function UpcomingMatches() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['upcoming'], queryFn: fetchUpcoming, staleTime: 15 * 60 * 1000 });
  if (isLoading) return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="card h-24 animate-pulse" />)}</div>;
  if (isError) return <div className="text-red-400">Could not load upcoming matches.</div>;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((fx: any) => (
        <a key={fx.fixture.id} href={`/match/${fx.fixture.id}`} className="card p-4 hover:bg-[var(--surface-hover)] transition">
          <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
            <span>{new Date(fx.fixture.date).toLocaleString()}</span>
            <span>{fx.league?.name}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-white">
            <div className="font-semibold">{fx.teams.home.name}</div>
            <span className="text-[var(--text-muted)]">vs</span>
            <div className="font-semibold">{fx.teams.away.name}</div>
          </div>
          <div className="mt-3 text-right">
            <button className="btn btn-primary text-sm px-3 py-1">Get Prediction</button>
          </div>
        </a>
      ))}
    </div>
  );
}
