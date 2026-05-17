import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GITHUB_REPO } from '../../lib/site';

const SLIDES = [
  { label: 'Intro', href: '#intro' },
  { label: 'Problem', href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'Flow', href: '#flow' },
  { label: 'Technical', href: '#technical' },
  { label: 'Demo', href: '#demo' },
  { label: 'Results', href: '#results' },
];

function HexLogo() {
  return (
    <svg width="22" height="26" viewBox="0 0 28 32" fill="none" aria-hidden>
      <polygon points="14,0 28,8 28,24 14,32 0,24 0,8" fill="var(--amber)" />
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[rgba(8,8,15,0.92)] backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 py-2.5 flex items-center justify-between">
        <a href="#intro" className="flex items-center gap-2">
          <HexLogo />
          <span className="font-display text-xl tracking-wider text-white">OPENHIVE</span>
        </a>

        <div className="hidden lg:flex items-center gap-5">
          {SLIDES.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="font-sans text-min text-muted hover:text-amber transition-colors"
            >
              {s.label}
            </a>
          ))}
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hex-clip-btn bg-amber text-bg font-display text-min px-4 py-1.5 tracking-wide"
          >
            CODE
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-amber transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-amber transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-amber transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-bg-2 border-b border-border overflow-hidden"
          >
            <div className="flex flex-col gap-3 p-5">
              {SLIDES.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-sans text-min text-muted hover:text-amber"
                >
                  {s.label}
                </a>
              ))}
              <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="font-display text-min text-amber">
                GitHub ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
