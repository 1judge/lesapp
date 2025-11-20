export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-10 py-6 text-center text-[var(--text-secondary)]">
      <div className="container">© {new Date().getFullYear()} Statto AI — Personal use</div>
    </footer>
  );
}
