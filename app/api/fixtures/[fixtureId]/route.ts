import { NextRequest, NextResponse } from 'next/server';
import { footballClient } from '@/lib/api/football-client';

export async function GET(_: NextRequest, { params }: { params: { fixtureId: string } }) {
  try {
    const id = Number(params.fixtureId);
    const fixture = await footballClient.getFixtureDetails(id);
    return NextResponse.json(fixture ?? null);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch fixture' }, { status: 500 });
  }
}
