async function getStats(teamId: number, leagueId: number, season: number) {
  const res = await fetch(`/api/teams/${teamId}/stats?league=${leagueId}&season=${season}`, { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  return res.json();
}

export async function StatsComparison({ homeId, awayId, leagueId, season }: { homeId: number; awayId: number; leagueId: number; season: number }) {
  const [home, away] = await Promise.all([
    getStats(homeId, leagueId, season),
    getStats(awayId, leagueId, season)
  ]);
  return (
    <div className="card p-4">
      <h3 className="text-h3 font-semibold">Statistics</h3>
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm text-white">
        <div className="text-left">
          <div className="text-[var(--text-secondary)]">Wins</div>
          <div className="text-[var(--text-secondary)]">Draws</div>
          <div className="text-[var(--text-secondary)]">Losses</div>
          <div className="text-[var(--text-secondary)]">Goals For</div>
          <div className="text-[var(--text-secondary)]">Goals Against</div>
        </div>
        <div className="text-center">
          <div>{home?.fixtures?.wins?.total ?? '-'}</div>
          <div>{home?.fixtures?.draws?.total ?? '-'}</div>
          <div>{home?.fixtures?.loses?.total ?? '-'}</div>
          <div>{home?.goals?.for?.total?.total ?? '-'}</div>
          <div>{home?.goals?.against?.total?.total ?? '-'}</div>
        </div>
        <div className="text-center">
          <div>{away?.fixtures?.wins?.total ?? '-'}</div>
          <div>{away?.fixtures?.draws?.total ?? '-'}</div>
          <div>{away?.fixtures?.loses?.total ?? '-'}</div>
          <div>{away?.goals?.for?.total?.total ?? '-'}</div>
          <div>{away?.goals?.against?.total?.total ?? '-'}</div>
        </div>
      </div>
    </div>
  );
}
