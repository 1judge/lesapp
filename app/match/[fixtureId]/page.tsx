import { notFound } from 'next/navigation';
import { ProbabilityBar } from '@/components/predictions/ProbabilityBar';
import { ConfidenceBadge } from '@/components/predictions/ConfidenceBadge';
import { RiskBadge } from '@/components/predictions/RiskBadge';
import { ExactScoreGrid } from '@/components/predictions/ExactScoreGrid';
import { LiveScoreDisplay } from '@/components/match/LiveScoreDisplay';
import { StatsComparison } from '@/components/match/StatsComparison';
import { FormGuide } from '@/components/match/FormGuide';
import { HeadToHeadTable } from '@/components/match/HeadToHeadTable';

async function getFixture(id: string) {
const res = await fetch(/api/fixtures/${id}, { next: { revalidate: 900 } });
if (!res.ok) return null;
return res.json();
}

async function getPrediction(id: string) {
const res = await fetch(/api/predictions/${id}, { cache: 'no-store' });
if (!res.ok) return null;
return res.json();
}

export default async function MatchPage({ params }: { params: { fixtureId: string } }) {
const fixture = await getFixture(params.fixtureId);
if (!fixture) notFound();
const prediction = await getPrediction(params.fixtureId);

return (
<div className="space-y-6">
<section className="card p-4">
<div className="text-sm text-[var(--text-secondary)]">
{fixture.league?.name} • {new Date(fixture.fixture?.date).toLocaleString()}
</div>
<div className="mt-2 flex items-center justify-between text-white text-xl font-semibold">
<div>{fixture.teams?.home?.name}</div>
<div className="text-[var(--text-muted)]">vs</div>
<div>{fixture.teams?.away?.name}</div>
</div>
</section>

{prediction ? (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="card p-4">
        <h3 className="text-h3 font-semibold">Live</h3>
        <LiveScoreDisplay fixtureId={fixture.fixture.id} initial={fixture} />
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-h3 font-semibold">Match Outcome</h3>
          <div className="flex items-center gap-2">
            <ConfidenceBadge value={prediction.matchOutcome.confidence} />
            <RiskBadge level={prediction.riskLevel} />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <ProbabilityBar label="Home Win" value={prediction.matchOutcome.homeWin} />
          <ProbabilityBar label="Draw" value={prediction.matchOutcome.draw} color="#60A5FA" />
          <ProbabilityBar label="Away Win" value={prediction.matchOutcome.awayWin} color="#F87171" />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-h3 font-semibold">Goals</h3>
        <div className="mt-2 text-sm text-[var(--text-secondary)]">
          Expected Total: <span className="text-white font-semibold">{prediction.goals.expectedTotal}</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(['0.5','1.5','2.5','3.5'] as const).map((line) => (
            <div key={line} className="card p-3">
              <div className="text-white font-medium">Over/Under {line}</div>
              <div className="mt-2 text-xs text-[var(--text-secondary)]">
                Over {prediction.goals.overUnder[line].over}% • Under {prediction.goals.overUnder[line].under}%
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="text-white font-medium mb-2">Top Exact Scores</div>
          <ExactScoreGrid scores={prediction.goals.topScores} />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-h3 font-semibold">Corners</h3>
        <div className="mt-2 text-sm text-[var(--text-secondary)]">
          Expected Total: <span className="text-white font-semibold">{prediction.corners.expectedTotal}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-[var(--text-secondary)]">
          {(['8.5','9.5','10.5'] as const).map((line) => (
            <div key={line} className="card p-2">
              <div className="text-white">O/U {line}</div>
              <div>O {prediction.corners.overUnder[line].over}% • U {prediction.corners.overUnder[line].under}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-h3 font-semibold">Cards</h3>
        <div className="mt-2 text-sm text-[var(--text-secondary)]">
          Expected Yellow: <span className="text-white font-semibold">{prediction.cards.expectedYellow}</span> •
          Expected Red: <span className="text-white font-semibold">{prediction.cards.expectedRed}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
          {(['3.5','4.5'] as const).map((line) => (
            <div key={line} className="card p-2">
              <div className="text-white">O/U {line}</div>
              <div>O {prediction.cards.overUnder[line].over}% • U {prediction.cards.overUnder[line].under}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-h3 font-semibold">3-Way Handicaps</h3>
        <div className="mt-2 grid gap-2 text-sm text-white">
          {prediction.handicaps?.map((h: any, idx: number) => (
            <div key={idx} className="card p-3">
              <div className="font-medium">Home {h.line >= 0 ? `+${h.line}` : h.line}</div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-[var(--text-secondary)]">
                <div>Home {h.home}%</div>
                <div>Draw {h.draw}%</div>
                <div>Away {h.away}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Server components that fetch and render stats/form/H2H */}
      <StatsComparison
        homeId={fixture.teams.home.id}
        awayId={fixture.teams.away.id}
        leagueId={fixture.league.id}
        season={fixture.league.season}
      />

      <FormGuide
        homeId={fixture.teams.home.id}
        awayId={fixture.teams.away.id}
        season={fixture.league.season}
      />

      <HeadToHeadTable
        homeId={fixture.teams.home.id}
        awayId={fixture.teams.away.id}
      />

      <div className="card p-4">
        <h3 className="text-h3 font-semibold">Key Insights</h3>
        <ul className="mt-3 list-disc pl-5 text-[var(--text-secondary)]">
          {prediction.keyInsights.map((i: string, idx: number) => <li key={idx}>{i}</li>)}
        </ul>
      </div>
    </section>
  ) : (
    <div className="text-[var(--text-secondary)]">Prediction is not available.</div>
  )}
</div>
);
}
