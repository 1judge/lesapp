import { NextRequest, NextResponse } from 'next/server';
import { footballClient } from '@/lib/api/football-client';

export async function GET(_: NextRequest, { params }: { params: { teamId: string } }) {
  try {
    const id = Number(params.teamId);
    // API-Football teams endpoint search by id
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/teams/search?query=${id}`);
    const data = await res.json();
    const team = Array.isArray(data) ? data.find((t: any) => t.team?.id === id) : null;
    return NextResponse.json(team ?? null);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}
