import { NextRequest, NextResponse } from 'next/server';
import { footballClient } from '@/lib/api/football-client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const home = Number(searchParams.get('home'));
    const away = Number(searchParams.get('away'));
    const last = Number(searchParams.get('last') || 10);
    if (!home || !away) return NextResponse.json([], { status: 200 });
    const data = await footballClient.getHeadToHead(home, away);
    return NextResponse.json(data?.slice(0, last) || []);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch H2H' }, { status: 500 });
  }
}
