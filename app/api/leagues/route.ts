import { NextResponse } from 'next/server';
import { footballClient } from '@/lib/api/football-client';

export async function GET() {
  try {
    const leagues = await footballClient.getLeagues();
    return NextResponse.json(leagues ?? []);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch leagues' }, { status: 500 });
  }
}
