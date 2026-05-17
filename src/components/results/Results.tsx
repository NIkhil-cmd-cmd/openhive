import { motion } from 'framer-motion';
import { Slide } from '../ui/Slide';

const METRICS = [
  { value: '71%', label: 'Fewer tokens', detail: 'warm vs cold agent' },
  { value: '3.5×', label: 'Fewer tool calls', detail: 'shared memory' },
  { value: '<2s', label: 'Faster routing', detail: 'Markov-guided path' },
];

export function Results() {
  return (
    <Slide id="results" step="07" label="Results" title="OPENHIVE PAYS OFF.">
      <div className="grid md:grid-cols-3 gap-8 mb-14">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="panel p-10 text-center"
          >
            <p className="text-stat text-amber mb-4">{m.value}</p>
            <p className="text-body-lg text-white font-semibold mb-2">{m.label}</p>
            <p className="font-mono text-min text-muted">{m.detail}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-body-lg text-center text-muted max-w-3xl mx-auto"
      >
        Run the demo — cold agent vs warm agent on the same prompt.
      </motion.p>
    </Slide>
  );
}
