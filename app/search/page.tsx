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
