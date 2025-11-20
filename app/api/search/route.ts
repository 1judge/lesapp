import { NextRequest, NextResponse } from 'next/server';
import { footballClient } from '@/lib/api/football-client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    if (!q) return NextResponse.json({ matches: [], teams: [], leagues: [] });
    const [teams, leagues] = await Promise.all([
      footballClient.searchTeams(q).catch(() => []),
      footballClient.getLeagues().then((ls) => ls.filter((l: any) => (l.league?.name || '').toLowerCase().includes(q.toLowerCase()))).catch(() => []),
    ]);
    return NextResponse.json({ matches: [], teams, leagues });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
