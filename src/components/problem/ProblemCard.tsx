import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ProblemCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export function ProblemCard({ title, description, icon }: ProblemCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45 }}
      className="panel p-6 h-full flex flex-col"
    >
      <div className="rounded-lg bg-[var(--amber-glow)] p-4 mb-5 h-24 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h3 className="font-display text-2xl text-white mb-2">{title}</h3>
      <p className="font-mono text-sm text-muted leading-relaxed flex-1">{description}</p>
    </motion.article>
  );
}
