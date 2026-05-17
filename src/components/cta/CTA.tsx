import { motion } from 'framer-motion';
import { Section } from '../ui/Section';
import { Button } from '../ui/Button';

export function CTA() {
  return (
    <Section id="cta" showGrid={false} className="border-t border-border">
      <div className="text-center max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-6xl md:text-7xl text-white leading-none mb-4"
        >
          JOIN THE HIVE.
        </motion.h2>
        <p className="font-mono text-amber mb-4">Your agents never start from zero again.</p>
        <p className="font-mono text-sm text-muted mb-10">
          Open source. Free to run. Connect your OpenHome agents and watch the hive learn.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="https://github.com/hivemind" variant="primary" size="lg" className="font-display">
            GET THE CODE
          </Button>
          <Button href="#" variant="secondary" size="md" className="font-mono text-sm">
            Read Docs
          </Button>
        </div>
      </div>
    </Section>
  );
}
