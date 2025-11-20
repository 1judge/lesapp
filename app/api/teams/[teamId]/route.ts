import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, ctx: { params: Promise<{ teamId: string }> }) {
  try {
    const { teamId } = await ctx.params;
    const id = Number(teamId);
    const base = process.env.NEXT_PUBLIC_APP_URL || '';
    const res = await fetch(`${base}/api/teams/search?query=${id}`);
    const data = await res.json();
    const team = Array.isArray(data) ? data.find((t: any) => t.team?.id === id) : null;
    return NextResponse.json(team ?? null);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}
