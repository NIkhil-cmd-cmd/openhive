import { motion } from 'framer-motion';
import { Section } from '../ui/Section';
import { HexBadge } from '../ui/HexBadge';
import { HiveDiagram } from './HiveDiagram';

const BENEFITS = ['Token Efficient', 'Model Agnostic', 'Infinitely Scalable'];

export function Solution() {
  return (
    <Section id="solution" tone="elevated">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="panel p-6 flex justify-center"
        >
          <HiveDiagram />
        </motion.div>

        <div>
          <p className="font-mono text-xs text-amber tracking-widest mb-3">THE SOLUTION</p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl md:text-6xl text-white leading-tight mb-5"
          >
            THE HIVE NEVER FORGETS.
          </motion.h2>
          <p className="font-mono text-sm text-muted leading-relaxed mb-6">
            HiveMind gives every agent access to collective memory. New agents inherit experience
            instantly. The hive compounds knowledge with every run.
          </p>
          <motion.div className="flex flex-wrap gap-2">
            {BENEFITS.map((b) => (
              <HexBadge key={b} variant="outline" size="sm">
                ⬡ {b}
              </HexBadge>
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
