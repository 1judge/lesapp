const FEATURED = [
  { id: 39, name: 'Premier League' },
  { id: 140, name: 'La Liga' },
  { id: 135, name: 'Serie A' },
  { id: 78, name: 'Bundesliga' },
  { id: 61, name: 'Ligue 1' },
  { id: 94, name: 'Primeira Liga' },
  { id: 88, name: 'Eredivisie' },
  { id: 2, name: 'Champions League' },
  { id: 3, name: 'Europa League' },
];

export function FeaturedLeagues() {
  return (
    <section className="space-y-3">
      <h2 className="text-h2 font-semibold">Featured Leagues</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED.map((l) => (
          <a key={l.id} href={`/leagues/${l.id}`} className="card p-4 hover:bg-[var(--surface-hover)] transition text-white">
            <div className="font-semibold">{l.name}</div>
            <div className="text-[var(--text-secondary)] text-sm">Matchweek & standings</div>
          </a>
        ))}
      </div>
    </section>
  );
}
