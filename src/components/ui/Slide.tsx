import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SlideProps {
  id: string;
  step: string;
  label: string;
  title?: string;
  children: ReactNode;
  tone?: 'default' | 'elevated';
  className?: string;
  innerClassName?: string;
}

export function Slide({
  id,
  step,
  label,
  title,
  children,
  tone = 'default',
  className = '',
  innerClassName = '',
}: SlideProps) {
  return (
    <section
      id={id}
      className={`slide min-h-[100dvh] snap-start snap-always flex flex-col justify-center py-28 md:py-32 relative isolate ${
        tone === 'elevated' ? 'bg-bg-2' : 'bg-bg'
      } ${className}`}
    >
      <div className={`relative z-10 w-full max-w-6xl mx-auto px-8 md:px-14 ${innerClassName}`}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-label text-amber tracking-[0.2em] uppercase mb-8"
        >
          <span className="text-white/50">{step}</span>
          <span className="mx-3 text-border">·</span>
          {label}
        </motion.p>

        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="slide-title text-white mb-10 md:mb-12"
          >
            {title}
          </motion.h2>
        )}

        {children}
      </div>
    </section>
  );
}
