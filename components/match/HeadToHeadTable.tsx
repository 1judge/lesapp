async function getH2H(home: number, away: number) {
  const res = await fetch(`/api/fixtures/h2h?home=${home}&away=${away}&last=10`, { next: { revalidate: 604800 } });
  if (!res.ok) return [];
  return res.json();
}

export async function HeadToHeadTable({ homeId, awayId }: { homeId: number; awayId: number }) {
  const matches = await getH2H(homeId, awayId);
  return (
    <div className="card p-4">
      <h3 className="text-h3 font-semibold">Head-to-Head</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-[var(--text-secondary)]">
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Home</th>
              <th className="text-left p-2">Away</th>
              <th className="text-left p-2">Score</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {matches.map((m: any, i: number) => (
              <tr key={i} className="border-t border-[var(--border)]">
                <td className="p-2">{new Date(m.fixture?.date).toLocaleDateString()}</td>
                <td className="p-2">{m.teams?.home?.name}</td>
                <td className="p-2">{m.teams?.away?.name}</td>
                <td className="p-2">{(m.goals?.home ?? 0)} - {(m.goals?.away ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
