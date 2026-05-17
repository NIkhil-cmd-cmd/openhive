import { motion } from 'framer-motion';
import { HiveCanvas } from './HiveCanvas';
import { useInViewport } from '../../hooks/useInViewport';

export function Hero() {
  const { ref, isActive } = useInViewport<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      id="intro"
      className="slide min-h-[100dvh] snap-start snap-always relative isolate flex flex-col items-center justify-center bg-bg overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HiveCanvas variant="hero" isActive={isActive} />
        <div className="absolute inset-0 hero-vignette" aria-hidden />
      </div>

      <div className="relative z-10 text-center px-8 md:px-14">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-7xl sm:text-8xl md:text-9xl text-amber tracking-wider mb-6"
        >
          OPENHIVE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-body-lg text-white font-medium"
        >
          Agents that think together
        </motion.p>

        <motion.p
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="font-mono text-min text-muted mt-20"
        >
          scroll ↓
        </motion.p>
      </div>
    </section>
  );
}
