import { motion } from 'framer-motion';
import { Slide } from '../ui/Slide';
import { HiveDiagram } from './HiveDiagram';

export function Solution() {
  return (
    <Slide id="solution" step="03" label="Solution" title="OPENHIVE: ONE MEMORY FOR ALL AGENTS." tone="elevated">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="panel p-8 flex justify-center"
        >
          <HiveDiagram />
        </motion.div>
        <div>
          <p className="text-body-lg text-muted mb-6">
            Every agent reads and writes the same vector memory. New runs inherit past tool paths instantly.
          </p>
          <ul className="space-y-5 text-body-lg text-white font-semibold">
            <li className="flex items-center gap-3">
              <span className="text-amber text-2xl">⬡</span> Fewer tool calls
            </li>
            <li className="flex items-center gap-3">
              <span className="text-amber text-2xl">⬡</span> Faster responses
            </li>
            <li className="flex items-center gap-3">
              <span className="text-amber text-2xl">⬡</span> Compounds over time
            </li>
          </ul>
        </div>
      </div>
    </Slide>
  );
}
