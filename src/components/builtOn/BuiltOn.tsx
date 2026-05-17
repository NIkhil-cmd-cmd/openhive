import { motion } from 'framer-motion';
import { Section } from '../ui/Section';

const LOGOS = [
  { name: 'OpenHome', sub: 'Voice AI' },
  { name: 'Supabase', sub: 'pgvector' },
  { name: 'OpenAI', sub: 'embeddings' },
  { name: 'Node.js', sub: 'API' },
  { name: 'React', sub: 'UI' },
];

export function BuiltOn() {
  return (
    <Section id="built-on">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-4xl md:text-5xl text-white text-center mb-10"
      >
        BUILT ON OPEN INFRASTRUCTURE
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {LOGOS.map((logo) => (
          <div
            key={logo.name}
            className="panel px-6 py-4 text-center min-w-[110px] hover:border-amber/40 transition-colors"
          >
            <span className="font-mono text-sm text-white block">{logo.name}</span>
            <span className="font-mono text-[10px] text-muted">{logo.sub}</span>
          </div>
        ))}
      </div>

      <p className="font-mono text-xs text-muted text-center max-w-md mx-auto">
        Open source. Model agnostic. Free tier. Swap any layer for your stack.
      </p>
    </Section>
  );
}
