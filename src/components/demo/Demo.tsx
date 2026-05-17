import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Section } from '../ui/Section';
import { CountUp } from '../ui/CountUp';
import { AgentFeed } from './AgentFeed';
import { ClusterMap } from './ClusterMap';
import { MarkovGraph } from './MarkovGraph';
import {
  createInitialState,
  tickSimulation,
  resetSimulation,
  type SimulationState,
  type BucketKey,
} from '../../lib/simulation';
import { useInViewport } from '../../hooks/useInViewport';

export function Demo() {
  const { ref, isActive } = useInViewport<HTMLDivElement>({ threshold: 0.15 });
  const [state, setState] = useState<SimulationState>(createInitialState);
  const [flashEdge, setFlashEdge] = useState<{ from: string; to: string } | undefined>();

  useEffect(() => {
    if (!isActive) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleTick = () => {
      timeoutId = setTimeout(() => {
        setState((s) => {
          const next = tickSimulation(s);
          const latest = next.events[0];
          if (latest?.edgeFlash) {
            setFlashEdge(latest.edgeFlash);
            setTimeout(() => setFlashEdge(undefined), 400);
          }
          return next;
        });
        scheduleTick();
      }, 2000 + Math.random() * 1000);
    };
    scheduleTick();
    return () => clearTimeout(timeoutId);
  }, [isActive]);

  const handleReset = useCallback(() => setState(resetSimulation()), []);

  return (
    <Section id="demo" showGrid={false}>
      <div ref={ref}>
        <p className="font-mono text-xs text-amber tracking-widest text-center mb-3">LIVE DEMO</p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-5xl md:text-6xl text-white text-center leading-tight mb-8"
        >
          WATCH THE HIVE LEARN.
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-8 mb-10 font-mono text-sm">
          {[
            { icon: '🧠', label: 'memories', value: state.stats.memoryCount },
            { icon: '🐝', label: 'agents', value: 3 },
            { icon: '⚡', label: 'tokens saved', value: state.stats.tokensSavedPct, suffix: '%' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 text-muted">
              <span>{stat.icon}</span>
              <CountUp to={stat.value} className="text-amber font-display text-2xl" />
              <span>
                {stat.label}
                {stat.suffix ?? ''}
              </span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="panel p-4 min-h-[300px]">
            <h3 className="font-mono text-[10px] text-amber tracking-widest mb-3">AGENT FEED</h3>
            <AgentFeed events={state.events} />
          </div>

          <div className="panel p-4 min-h-[300px]">
            <h3 className="font-mono text-[10px] text-amber tracking-widest mb-3">CLUSTER MAP</h3>
            <ClusterMap memories={state.memories} active={isActive} />
          </div>

          <div className="panel p-4 min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-mono text-[10px] text-amber tracking-widest">MARKOV GRAPH</h3>
              <select
                value={state.selectedBucket}
                onChange={(e) =>
                  setState((s) => ({ ...s, selectedBucket: e.target.value as BucketKey }))
                }
                className="bg-bg-3 border border-border text-white font-mono text-[10px] px-2 py-1 rounded"
              >
                {(['smart_home', 'information', 'scheduling'] as BucketKey[]).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-h-[200px]">
              <MarkovGraph
                bucket={state.selectedBucket}
                state={state.markovByBucket[state.selectedBucket]}
                flashEdge={flashEdge}
                active={isActive}
              />
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="mt-3 w-full font-mono text-[10px] text-amber border border-border py-2 hover:bg-[var(--amber-glow)] transition-colors rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
