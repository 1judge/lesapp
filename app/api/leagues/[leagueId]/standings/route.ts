import { NextRequest, NextResponse } from 'next/server';
import { footballClient } from '@/lib/api/football-client';

export async function GET(req: NextRequest, { params }: { params: { leagueId: string } }) {
  try {
    const id = Number(params.leagueId);
    const { searchParams } = new URL(req.url);
    const season = Number(searchParams.get('season') || new Date().getUTCFullYear());
    const standings = await footballClient.getStandings(id, season);
    return NextResponse.json(standings ?? null);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
  }
}
