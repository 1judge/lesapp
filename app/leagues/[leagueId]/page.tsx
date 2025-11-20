async function getStandings(leagueId: string) {
  const res = await fetch(`/api/leagues/${leagueId}/standings`);
  if (!res.ok) return null;
  return res.json();
}

export default async function LeagueDetail({ params }: { params: { leagueId: string } }) {
  const standings = await getStandings(params.leagueId);
  return (
    <div className="space-y-4">
      <h1 className="text-h1 font-semibold">League</h1>
      <div className="card p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-[var(--text-secondary)]">
            <tr>
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Team</th>
              <th className="text-right p-2">P</th>
              <th className="text-right p-2">W</th>
              <th className="text-right p-2">D</th>
              <th className="text-right p-2">L</th>
              <th className="text-right p-2">GF</th>
              <th className="text-right p-2">GA</th>
              <th className="text-right p-2">GD</th>
              <th className="text-right p-2">Pts</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {standings?.league?.standings?.[0]?.map((row: any) => (
              <tr key={row.team.id} className="border-t border-[var(--border)]">
                <td className="p-2">{row.rank}</td>
                <td className="p-2">{row.team.name}</td>
                <td className="p-2 text-right">{row.all.played}</td>
                <td className="p-2 text-right">{row.all.win}</td>
                <td className="p-2 text-right">{row.all.draw}</td>
                <td className="p-2 text-right">{row.all.lose}</td>
                <td className="p-2 text-right">{row.all.goals.for}</td>
                <td className="p-2 text-right">{row.all.goals.against}</td>
                <td className="p-2 text-right">{row.goalsDiff}</td>
                <td className="p-2 text-right font-semibold">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
