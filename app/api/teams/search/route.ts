import { NextRequest, NextResponse } from 'next/server';
import { footballClient } from '@/lib/api/football-client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('query') || '';
    if (!q) return NextResponse.json([]);
    const teams = await footballClient.searchTeams(q);
    return NextResponse.json(teams ?? []);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to search teams' }, { status: 500 });
  }
}
