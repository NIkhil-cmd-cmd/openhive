import { GITHUB_REPO } from '../../lib/site';

export function Footer() {
  return (
    <footer className="py-8 px-8 border-t border-border bg-bg-2">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-body text-muted font-sans">
        <span className="font-display text-2xl text-white">OPENHIVE</span>
        <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="hover:text-amber transition-colors">
          github.com/NIkhil-cmd-cmd/openhive
        </a>
      </div>
    </footer>
  );
}
