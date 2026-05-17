import { motion } from 'framer-motion';
import { Slide } from '../ui/Slide';

const STACK = [
  { name: 'OpenHome Voice SDK', role: 'Agents' },
  { name: 'Supabase pgvector', role: 'Memory' },
  { name: 'text-embedding-3-small', role: 'Vectors' },
  { name: 'Markov router', role: 'Tool paths' },
  { name: 'Node + Express', role: 'API' },
];

const FLOW = ['embed prompt', 'KNN retrieve', 'Markov route', 'execute tools', 'write back'];

export function Technical() {
  return (
    <Slide id="technical" step="04" label="Technical" title="HOW IT WORKS UNDER THE HOOD.">
      <div className="grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="panel p-10"
        >
          <p className="font-mono text-label text-amber mb-8">Pipeline</p>
          <ol className="space-y-6">
            {FLOW.map((step, i) => (
              <li key={step} className="flex items-center gap-5 text-body-lg text-white font-medium">
                <span className="font-display text-4xl text-amber w-12 shrink-0">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="panel p-10"
        >
          <p className="font-mono text-label text-amber mb-8">Stack</p>
          <ul className="space-y-6">
            {STACK.map((item) => (
              <li key={item.name} className="flex justify-between gap-4 text-body-lg">
                <span className="text-white font-semibold">{item.name}</span>
                <span className="text-muted font-mono text-min">{item.role}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Slide>
  );
}
