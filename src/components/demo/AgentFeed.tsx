import { AnimatePresence, motion } from 'framer-motion';
import type { AgentEvent } from '../../lib/simulation';
import { BUCKET_COLORS } from '../../lib/simulation';

interface AgentFeedProps {
  events: AgentEvent[];
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}ms ago`;
  return `${Math.floor(s / 60)}m ago`;
}

export function AgentFeed({ events }: AgentFeedProps) {
  return (
    <div className="h-[320px] overflow-hidden flex flex-col gap-2">
      <AnimatePresence initial={false}>
        {events.slice(0, 8).map((evt) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35 }}
            className="bg-bg-2 border border-border rounded-lg p-3 font-mono text-[11px] border-l-[3px] border-l-amber"
          >
            <div className="flex justify-between text-muted mb-1">
              <span>
                <span className="text-amber">●</span> {evt.agentId}
              </span>
              <span>{timeAgo(evt.timestamp)}</span>
            </div>
            <p className="text-white mb-1">prompt: &quot;{evt.prompt}&quot;</p>
            <p>
              bucket:{' '}
              <span
                className="px-1.5 py-0.5 rounded"
                style={{
                  background: `${BUCKET_COLORS[evt.bucket]}22`,
                  color: BUCKET_COLORS[evt.bucket],
                }}
              >
                [{evt.bucket}]
              </span>
            </p>
            <p className="text-muted">route: [{evt.route.join(', ')}]</p>
            <p>confidence: {evt.confidence}%</p>
            <p className="text-teal-light">tokens saved: ~{evt.tokensSaved}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
