export function ExactScoreGrid({ scores }: { scores: Array<{ homeScore: number; awayScore: number; probability: number }> }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {scores.map((s, idx) => (
        <div key={idx} className="card p-2 text-sm text-white">
          <div className="font-semibold">{s.homeScore} - {s.awayScore}</div>
          <div className="text-[var(--text-secondary)]">{s.probability.toFixed(1)}%</div>
        </div>
      ))}
    </div>
  );
}
