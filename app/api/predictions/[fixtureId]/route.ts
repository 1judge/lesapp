import { NextRequest, NextResponse } from 'next/server';
import { predictionEngine, TeamStats, LeagueStats } from '@/lib/predictions/engine';
import { footballClient } from '@/lib/api/football-client';

async function mapTeamStats(apiStats: any): Promise<TeamStats> {
  const lastFive = (apiStats?.form?.split('') || []).slice(-5).map((r: string) => ({ result: r as 'W'|'L'|'D', goalsScored: 0, goalsConceded: 0, opponent: '' }));
  return {
    matchesPlayed: apiStats?.fixtures?.played?.total || 0,
    wins: apiStats?.fixtures?.wins?.total || 0,
    draws: apiStats?.fixtures?.draws?.total || 0,
    losses: apiStats?.fixtures?.loses?.total || 0,
    goalsScored: apiStats?.goals?.for?.total?.total || 0,
    goalsConceded: apiStats?.goals?.against?.total?.total || 0,
    home: {
      played: apiStats?.fixtures?.played?.home || 0,
      wins: apiStats?.fixtures?.wins?.home || 0,
      goalsScored: apiStats?.goals?.for?.total?.home || 0,
      goalsConceded: apiStats?.goals?.against?.total?.home || 0,
    },
    away: {
      played: apiStats?.fixtures?.played?.away || 0,
      wins: apiStats?.fixtures?.wins?.away || 0,
      goalsScored: apiStats?.goals?.for?.total?.away || 0,
      goalsConceded: apiStats?.goals?.against?.total?.away || 0,
    },
    lastFive,
    leaguePosition: apiStats?.league?.rank || 0,
    points: apiStats?.league?.points || 0,
    form: apiStats?.form || '',
  };
}

export async function GET(_: NextRequest, { params }: { params: { fixtureId: string } }) {
  try {
    const fixtureId = Number(params.fixtureId);
    const fixture = await footballClient.getFixtureDetails(fixtureId);
    const season = fixture?.league?.season || new Date().getUTCFullYear();
    const leagueId = fixture?.league?.id;
    const homeTeamId = fixture?.teams?.home?.id;
    const awayTeamId = fixture?.teams?.away?.id;

    if (!leagueId || !homeTeamId || !awayTeamId) return NextResponse.json({ error: 'Fixture not found' }, { status: 404 });

    const result = await predictionEngine.generatePrediction(
      homeTeamId,
      awayTeamId,
      fixtureId,
      leagueId,
      {
        getTeamStats: async (teamId: number, lId: number) => {
          const stats = await footballClient.getTeamStatistics(teamId, season, lId);
          return mapTeamStats(stats);
        },
        getHeadToHead: async (h: number, a: number) => {
          const h2h = await footballClient.getHeadToHead(h, a);
          return h2h;
        },
        getLeagueStats: async (lId: number): Promise<LeagueStats> => {
          // Approximate average goals from last fixtures in league
          const today = new Date().toISOString().slice(0, 10);
          const fixtures = await footballClient.getFixtures({ league: lId, date: today, season });
          const goals = fixtures?.map((f: any) => (f.goals?.home ?? 0) + (f.goals?.away ?? 0)) || [];
          const avg = goals.length ? goals.reduce((a: number, b: number) => a + b, 0) / goals.length : 2.6;
          return { avgGoals: avg };
        },
      }
    );

    return NextResponse.json(result);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to generate prediction' }, { status: 500 });
  }
}
