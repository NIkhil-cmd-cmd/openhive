import { motion } from 'framer-motion';
import { Section } from '../ui/Section';
import { TerminalWindow } from './TerminalWindow';
import { HexBadge } from '../ui/HexBadge';

const ARCH_DIAGRAM = `┌─────────────────────────────────┐
│  Agent A ──┐                    │
│  Agent B ──┼──→ POST /route     │
│  Agent C ──┘         │          │
│                       ▼         │
│            embed(prompt)        │
│            KNN (pgvector)       │
│            Markov → tool route  │
│            { route, bucket }    │
└─────────────────────────────────┘`;

const SQL_SCHEMA = `create extension vector;

create table memories (
  id uuid primary key,
  embedding vector(1536),
  bucket text,
  tool_seq jsonb
);

create table markov_transitions (
  bucket text, from_tool text,
  to_tool text, count int
);`;

const STACK = [
  { name: 'OpenHome Voice SDK', desc: 'agent runtime' },
  { name: 'Supabase pgvector', desc: 'vector DB' },
  { name: 'OpenAI emb-3-small', desc: 'embeddings' },
  { name: 'Node.js + Express', desc: 'API' },
  { name: 'Railway', desc: 'hosting' },
];

export function Technical() {
  return (
    <Section id="technical" tone="elevated">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-5xl md:text-6xl text-white text-center leading-tight mb-12"
      >
        BUILT ON REAL INFRASTRUCTURE
      </motion.h2>

      <div className="grid lg:grid-cols-3 gap-5">
        <TerminalWindow title="hivemind ~/server" typewriter>
          {ARCH_DIAGRAM}
        </TerminalWindow>
        <TerminalWindow title="supabase ~/sql" typewriter>
          {SQL_SCHEMA}
        </TerminalWindow>
        <div className="panel p-6 flex flex-col">
          <h3 className="font-display text-3xl text-white mb-5">RUNS FOR FREE</h3>
          <ul className="space-y-3 flex-1">
            {STACK.map((item) => (
              <li key={item.name} className="font-mono text-xs">
                <span className="text-amber">⬡</span>{' '}
                <span className="text-white">{item.name}</span>
                <span className="text-muted"> — {item.desc}</span>
              </li>
            ))}
          </ul>
          <p className="font-display text-xl text-amber mt-6">TOTAL COST = $0</p>
          <HexBadge variant="glow" size="md" className="mt-4 w-full justify-center">
            MIT LICENSE
          </HexBadge>
        </div>
      </div>
    </Section>
  );
}
