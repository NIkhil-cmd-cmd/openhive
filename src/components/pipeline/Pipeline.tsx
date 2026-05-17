import { motion } from 'framer-motion';
import { Section } from '../ui/Section';
import { HexBadge } from '../ui/HexBadge';

const STEPS = [
  {
    number: '01',
    title: 'Embed',
    summary: 'Prompt → 1536-d vector via OpenAI embeddings.',
    detail: 'Similar prompts cluster in vector space.',
  },
  {
    number: '02',
    title: 'Cluster',
    summary: 'KNN finds 5 nearest memories across all agents.',
    detail: 'Majority vote assigns the intent bucket.',
  },
  {
    number: '03',
    title: 'Predict',
    summary: 'Markov chain picks the most likely tool route.',
    detail: 'Built from every past execution in that bucket.',
  },
  {
    number: '04',
    title: 'Learn',
    summary: 'Write-back updates shared memory instantly.',
    detail: 'All future agents benefit from every run.',
  },
];

export function Pipeline() {
  return (
    <Section id="how-it-works">
      <p className="font-mono text-xs text-amber tracking-widest text-center mb-3">HOW IT WORKS</p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-5xl md:text-6xl text-white text-center leading-tight mb-12"
      >
        FOUR STEPS. ZERO WASTED TOKENS.
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="panel p-5 flex flex-col h-full"
          >
            <HexBadge variant="fill" size="sm" className="mb-3 w-fit">
              {step.number}
            </HexBadge>
            <h3 className="font-display text-2xl text-white mb-2">{step.title}</h3>
            <p className="font-mono text-xs text-white/90 mb-2 leading-relaxed">{step.summary}</p>
            <p className="font-mono text-xs text-muted mt-auto leading-relaxed">{step.detail}</p>
          </motion.div>
        ))}
      </div>

      <div className="panel p-5 md:p-6 overflow-x-auto">
        <pre className="font-mono text-[11px] md:text-xs text-muted leading-relaxed whitespace-pre">
{`Agent prompt
    → embed (text-embedding-3-small)
    → KNN match (pgvector, top-5)
    → bucket vote + Markov route
    → execute tools → writeBack()
    → hive updated for all agents  (<50ms route)`}
        </pre>
      </div>
    </Section>
  );
}
