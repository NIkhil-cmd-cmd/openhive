import { motion } from 'framer-motion';
import { HiveCanvas } from './HiveCanvas';
import { AgentStatusBar } from './AgentStatusBar';
import { Button } from '../ui/Button';
import { useInViewport } from '../../hooks/useInViewport';

const HEADLINE_WORDS = ['AI', 'AGENTS', 'THAT', 'THINK', 'TOGETHER.'];

export function Hero() {
  const { ref, isActive } = useInViewport<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      id="hero"
      className="relative isolate min-h-[100dvh] flex flex-col bg-bg overflow-hidden"
    >
      {/* Background layer — never overlaps readable content */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HiveCanvas variant="hero" isActive={isActive} />
        <div className="absolute inset-0 hero-vignette" aria-hidden />
      </div>

      {/* Main copy */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-8">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[13px] tracking-[0.25em] text-amber mb-5"
        >
          OPENHOME × HIVEMIND
        </motion.p>

        <h1 className="font-display text-white leading-[0.95] mb-6 max-w-4xl">
          <span className="flex flex-wrap justify-center gap-x-3 md:gap-x-4">
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={word}
                className="text-5xl sm:text-7xl md:text-[88px]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="font-mono text-sm md:text-base text-muted max-w-lg mb-10 leading-relaxed"
        >
          Shared memory for voice agents — every agent&apos;s experience teaches every future agent.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 items-center"
        >
          <Button href="#how-it-works" variant="primary" size="lg" className="font-display text-lg">
            SEE HOW IT WORKS
          </Button>
          <Button
            href="https://github.com/hivemind"
            variant="secondary"
            size="md"
            className="font-mono text-sm"
          >
            → github.com/hivemind
          </Button>
        </motion.div>
      </div>

      {/* Agent strip — solid bar, no float overlap */}
      <div className="relative z-20 border-t border-border bg-bg/95 backdrop-blur-sm">
        <AgentStatusBar />
      </div>
    </section>
  );
}
