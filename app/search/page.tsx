import { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function SearchPage() {
return (
<div className="space-y-4">
<h1 className="text-h1 font-semibold">Search</h1>
<Suspense fallback={<div>Loading search…</div>}>
<SearchClient />
</Suspense>
</div>
);
}

Create app/search/SearchClient.tsx with the client logic Paste your previous search code here (it uses useSearchParams and React Query).
'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

async function fetchSearch(q: string) {
const res = await fetch('/api/search?q=' + encodeURIComponent(q));
if (!res.ok) throw new Error('Search failed');
return res.json();
}

export default function SearchClient() {
const params = useSearchParams();
const q = params.get('q') || '';
const { data, isLoading } = useQuery({
queryKey: ['search', q],
queryFn: () => fetchSearch(q),
enabled: !!q,
});

return (
<>
<div className="text-[var(--text-secondary)]">Query: {q}</div>
{isLoading && <div>Searching…</div>}
{!isLoading && data && (
<div className="grid gap-4">
<div>
<h2 className="text-h3 mb-2">Teams</h2>
<div className="grid gap-2">
{data.teams?.map((t: any, i: number) => (
<a
key={i}
href={/team/${t.team.id}}
className="card p-3 text-white hover:bg-[var(--surface-hover)] transition"
>
{t.team.name}
</a>
))}
</div>
</div>
<div>
<h2 className="text-h3 mb-2">Leagues</h2>
<div className="grid gap-2">
{data.leagues?.map((l: any, i: number) => (
<a
key={i}
href={/leagues/${l.league.id}}
className="card p-3 text-white hover:bg-[var(--surface-hover)] transition"
>
{l.league.name}
</a>
))}
</div>
</div>
</div>
)}
</>
);
}
