"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function SearchBar() {
  const [q, setQ] = useState('');
  const router = useRouter();

  useEffect(() => {
    try {
      const recent = localStorage.getItem('recent-search');
      if (recent) setQ(recent);
    } catch {}
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try { localStorage.setItem('recent-search', q); } catch {}
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search for any match, team, or league..."
        className="w-full rounded-md bg-[var(--surface-hover)] border border-[var(--border)] pl-10 pr-3 py-2 text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
    </form>
  );
}
