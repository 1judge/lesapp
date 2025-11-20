import { NextResponse } from 'next/server';
import { footballClient } from '@/lib/api/football-client';

export async function GET() {
  try {
    const now = new Date();
    const target = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dateStr = target.toISOString().slice(0, 10);
    const fixtures = await footballClient.getFixtures({ date: dateStr, season: now.getUTCFullYear() });
    // Limit to major leagues fallback if necessary
    return NextResponse.json(fixtures ?? []);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch upcoming fixtures' }, { status: 500 });
  }
}
