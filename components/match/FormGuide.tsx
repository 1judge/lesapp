function outcomeBox(f: any, teamId: number) {
  const home = f.teams?.home?.id === teamId;
  const result = f.teams?.home?.winner === true ? (home ? 'W' : 'L') : f.teams?.away?.winner === true ? (home ? 'L' : 'W') : 'D';
  const color = result === 'W' ? 'bg-green-600/40' : result === 'L' ? 'bg-red-600/40' : 'bg-yellow-600/40';
  const score = `${f.goals?.home ?? 0}-${f.goals?.away ?? 0}`;
  const opp = home ? f.teams?.away?.name : f.teams?.home?.name;
  return <div className={`rounded p-2 ${color}`}>
    <div className="text-white text-xs font-bold">{result}</div>
    <div className="text-[var(--text-secondary)] text-[10px]">{opp}</div>
    <div className="text-[var(--text-secondary)] text-[10px]">{score}</div>
  </div>;
}

async function getLastFixtures(teamId: number, season: number) {
  const res = await fetch(`/api/teams/${teamId}/fixtures?last=10&season=${season}`, { next: { revalidate: 900 } });
  if (!res.ok) return [];
  return res.json();
}

export async function FormGuide({ homeId, awayId, season }: { homeId: number; awayId: number; season: number }) {
  const [homeLast, awayLast] = await Promise.all([
    getLastFixtures(homeId, season),
    getLastFixtures(awayId, season),
  ]);
  return (
    <div className="card p-4">
      <h3 className="text-h3 font-semibold">Form Guide (Last 10)</h3>
      <div className="mt-3 grid gap-3">
        <div>
          <div className="text-xs text-[var(--text-secondary)] mb-1">Home</div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1">
            {homeLast.map((f: any) => outcomeBox(f, homeId))}
          </div>
        </div>
        <div>
          <div className="text-xs text-[var(--text-secondary)] mb-1">Away</div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1">
            {awayLast.map((f: any) => outcomeBox(f, awayId))}
          </div>
        </div>
      </div>
    </div>
  );
}
