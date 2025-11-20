import { NextRequest, NextResponse } from 'next/server';
import { footballClient } from '@/lib/api/football-client';

export async function GET(req: NextRequest, ctx: { params: Promise<{ leagueId: string }> }) {
  try {
    const { leagueId } = await ctx.params;
    const league = Number(leagueId);
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || undefined;
    const season = Number(searchParams.get('season') || new Date().getUTCFullYear());
    const fixtures = await footballClient.getFixtures({ league, date: date as any, season });
    return NextResponse.json(fixtures ?? []);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch league fixtures' }, { status: 500 });
  }
}
