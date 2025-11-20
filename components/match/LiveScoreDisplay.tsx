"use client";
import { useQuery } from '@tanstack/react-query';
import { LiveIndicator } from './LiveIndicator';

async function fetchFixture(id: number) {
  const res = await fetch(`/api/fixtures/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

function isLive(status: any) {
  const s = status?.short;
  return ['1H','2H','ET','P','LIVE'].includes(s) || status?.elapsed > 0;
}

export function LiveScoreDisplay({ fixtureId, initial }: { fixtureId: number; initial: any }) {
  const live = isLive(initial?.fixture?.status);
  const { data } = useQuery({ queryKey: ['fixture', fixtureId], queryFn: () => fetchFixture(fixtureId), refetchInterval: live ? 60000 : false, initialData: initial });
  const status = data?.fixture?.status;
  const minute = status?.elapsed ? `${status.elapsed}'` : '';
  return (
    <div className="flex items-center gap-3 text-white">
      {isLive(status) && <LiveIndicator />}
      <div className="text-2xl font-bold">{data?.goals?.home ?? 0} - {data?.goals?.away ?? 0}</div>
      {minute && <div className="text-sm text-[var(--text-secondary)]">{minute}</div>}
    </div>
  );
}
