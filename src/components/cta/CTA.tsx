import { motion } from 'framer-motion';
import { Section } from '../ui/Section';

export function CTA() {
  return (
    <Section id="cta" showGrid={false} className="border-t border-border py-16">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-mono text-sm text-muted text-center"
      >
        Made by <span className="text-amber">Advaiyt Sane</span> and{' '}
        <span className="text-amber">Nikhil Krishnaswamy</span>
      </motion.p>
    </Section>
  );
}
