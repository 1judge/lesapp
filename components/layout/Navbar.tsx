"use client";
import Link from 'next/link';
import { SearchBar } from './SearchBar';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between gap-3">
        <Link href="/" className="text-white font-semibold text-lg">Statto AI</Link>
        <div className="flex-1 max-w-2xl">
          <SearchBar />
        </div>
        <nav className="hidden md:flex items-center gap-4 text-[var(--text-secondary)]">
          <Link href="/live">Live</Link>
          <Link href="/leagues">Leagues</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
