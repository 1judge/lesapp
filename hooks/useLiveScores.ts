"use client";
import { useQuery } from '@tanstack/react-query';

async function fetchLiveScores() {
  const res = await fetch('/api/fixtures/live', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export function useLiveScores(enabled: boolean = true) {
  return useQuery({ queryKey: ['liveScores'], queryFn: fetchLiveScores, refetchInterval: enabled ? 60000 : false, enabled });
}
