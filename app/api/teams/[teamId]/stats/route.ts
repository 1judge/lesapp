import { NextRequest, NextResponse } from 'next/server';
import { footballClient } from '@/lib/api/football-client';

export async function GET(req: NextRequest, ctx: { params: Promise<{ teamId: string }> }) {
  try {
    const { teamId } = await ctx.params;
    const id = Number(teamId);
    const { searchParams } = new URL(req.url);
    const season = Number(searchParams.get('season') || new Date().getUTCFullYear());
    const league = Number(searchParams.get('league') || 0);
    if (!league) return NextResponse.json({ error: 'league is required' }, { status: 400 });
    const stats = await footballClient.getTeamStatistics(id, season, league);
    return NextResponse.json(stats);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch team stats' }, { status: 500 });
  }
}
