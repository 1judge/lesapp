import { NextRequest, NextResponse } from 'next/server';
import { footballClient } from '@/lib/api/football-client';

export async function GET(req: NextRequest, { params }: { params: { teamId: string } }) {
  try {
    const team = Number(params.teamId);
    const { searchParams } = new URL(req.url);
    const last = Number(searchParams.get('last') || 10);
    const season = Number(searchParams.get('season') || new Date().getUTCFullYear());
    const fixtures = await footballClient.getFixtures({ team, season, last });
    return NextResponse.json(fixtures ?? []);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch team fixtures' }, { status: 500 });
  }
}
