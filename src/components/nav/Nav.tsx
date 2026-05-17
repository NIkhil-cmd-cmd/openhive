import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Technical', href: '#technical' },
  { label: 'Demo', href: '#demo' },
  { label: 'GitHub', href: 'https://github.com/hivemind', external: true },
];

function HexLogo() {
  return (
    <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden>
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
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(8,8,15,0.9)] backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <HexLogo />
          <span className="font-display text-2xl tracking-wider text-white">HIVEMIND</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="font-mono text-[13px] text-muted hover:text-amber transition-colors flex items-center gap-1"
            >
              {link.label}
              {link.external && <span className="text-[10px]">↗</span>}
            </a>
          ))}
          <a
            href="https://github.com/hivemind"
            target="_blank"
            rel="noopener noreferrer"
            className="hex-clip-btn bg-amber text-bg font-display text-sm px-5 py-2 tracking-wide hover:shadow-[0_0_20px_var(--amber-glow)] transition-all"
          >
            GET THE CODE
          </a>
        </div>

        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-amber transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span className={`block w-6 h-0.5 bg-amber transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span
            className={`block w-6 h-0.5 bg-amber transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[rgba(8,8,15,0.95)] backdrop-blur-md border-b border-border overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-sm text-muted hover:text-amber"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://github.com/hivemind"
                className="hex-clip-btn bg-amber text-bg font-display text-center py-3 tracking-wide"
              >
                GET THE CODE
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
