function HexLogo() {
  return (
    <svg width="24" height="28" viewBox="0 0 28 32" fill="none" aria-hidden>
      <polygon points="14,0 28,8 28,24 14,32 0,24 0,8" fill="var(--amber)" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-bg-2 border-t border-border py-12 px-6 flex items-center">
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <HexLogo />
          <div>
            <span className="font-display text-xl text-white">HIVEMIND</span>
            <p className="font-mono text-xs text-muted mt-1">The hive never forgets.</p>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 font-mono text-sm text-muted">
          <a href="https://github.com/hivemind" className="hover:text-amber transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-amber transition-colors">
            Docs
          </a>
          <a href="https://openhome.com/" className="hover:text-amber transition-colors">
            OpenHome
          </a>
          <a href="https://supabase.com" className="hover:text-amber transition-colors">
            Supabase
          </a>
        </nav>

        <div className="font-mono text-xs text-muted text-center md:text-right">
          <p>Built on OpenHome Voice SDK</p>
          <p>MIT License · 2025</p>
        </div>
      </div>
    </footer>
  );
}
