import { motion } from 'framer-motion';

export function CTA() {
  return (
    <section className="slide snap-start py-16 border-t border-border">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-sans text-body-lg text-muted text-center"
      >
        Made by <span className="text-amber font-medium">Advaiyt Sane</span> and{' '}
        <span className="text-amber font-medium">Nikhil Krishnaswamy</span>
      </motion.p>
    </section>
  );
}
