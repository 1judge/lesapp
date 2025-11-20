async function getLeagues() {
  const res = await fetch(`/api/leagues`, { next: { revalidate: 43200 } });
  if (!res.ok) return [];
  return res.json();
}

export default async function LeaguesPage() {
  const leagues = await getLeagues();
  return (
    <div className="space-y-4">
      <h1 className="text-h1 font-semibold">Leagues</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leagues.map((l: any, i: number) => (
          <a key={i} href={`/leagues/${l.league?.id}`} className="card p-4 hover:bg-[var(--surface-hover)] transition text-white">
            <div className="font-semibold">{l.league?.name}</div>
            <div className="text-[var(--text-secondary)] text-sm">{l.country?.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
