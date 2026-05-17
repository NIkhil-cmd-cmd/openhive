import { motion } from 'framer-motion';
import { Section } from '../ui/Section';
import { HiveMindDiagram } from './HiveMindDiagram';

export function Pipeline() {
  return (
    <Section id="how-it-works" innerClassName="max-w-7xl">
      <p className="font-mono text-xs text-amber tracking-widest text-center mb-3">HOW IT WORKS</p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-5xl md:text-6xl text-white text-center leading-tight mb-4"
      >
        A LIVING MEMORY SYSTEM
      </motion.h2>
      <p className="font-mono text-sm text-muted text-center max-w-2xl mx-auto mb-10 leading-relaxed">
        Every agent reads from and writes to one shared hive.{' '}
        <span className="text-white">Read path:</span> embed → KNN → Markov.{' '}
        <span className="text-white">Write path:</span> execute → write-back. The loop never stops learning.
      </p>
      <HiveMindDiagram />
    </Section>
  );
}
