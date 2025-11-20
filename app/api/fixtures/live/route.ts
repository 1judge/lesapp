import { NextResponse } from 'next/server';
import { footballClient } from '@/lib/api/football-client';

export async function GET() {
  try {
    const live = await footballClient.getFixtures({ live: 'all' });
    return NextResponse.json(live ?? []);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch live matches' }, { status: 500 });
  }
}
