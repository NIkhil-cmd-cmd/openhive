import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slide } from '../ui/Slide';
import { recordTransition, type MarkovState } from '../../lib/markov';
import { AgentPanel } from './AgentPanel';
import { EmbeddingCloud } from './EmbeddingCloud';
import { RaceMarkovGraph } from './RaceMarkovGraph';
import {
  FLIGHT_PROMPT,
  COLD_STEPS,
  WARM_STEPS,
  COLD_MARKOV_PATH,
  WARM_MARKOV_PATH,
  SYNTHETIC_TRACES,
  TRACE_EMBEDDINGS,
  buildColdMarkov,
  EMPTY_MARKOV,
  type EmbeddingPoint,
} from './raceData';

type Phase = 'idle' | 'cold' | 'learning' | 'warm_ready' | 'warm' | 'done';

const TOTAL_COLD_TOKENS = COLD_STEPS.reduce((s, st) => s + st.tokens, 0);
const TOTAL_WARM_TOKENS = WARM_STEPS.reduce((s, st) => s + st.tokens, 0);
const TOTAL_COLD_MS = COLD_STEPS.reduce((s, st) => s + st.durationMs, 0);
const TOTAL_WARM_MS = WARM_STEPS.reduce((s, st) => s + st.durationMs, 0);
const SAVINGS_PCT = Math.round(((TOTAL_COLD_TOKENS - TOTAL_WARM_TOKENS) / TOTAL_COLD_TOKENS) * 100);
const SPEED_PCT = Math.round(((TOTAL_COLD_MS - TOTAL_WARM_MS) / TOTAL_COLD_MS) * 100);

export function RaceDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [coldRevealedCount, setColdRevealedCount] = useState(0);
  const [warmRevealedCount, setWarmRevealedCount] = useState(0);
  const [learnProgress, setLearnProgress] = useState(0);
  const [markovState, setMarkovState] = useState<MarkovState>(EMPTY_MARKOV);
  const [embeddingPoints, setEmbeddingPoints] = useState<EmbeddingPoint[]>([]);
  const [flashEdge, setFlashEdge] = useState<{ from: string; to: string } | undefined>();
  const [coldElapsedMs, setColdElapsedMs] = useState(0);
  const [warmElapsedMs, setWarmElapsedMs] = useState(0);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearAll() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  // Cold run phase
  useEffect(() => {
    if (phase !== 'cold') return;

    clearAll();
    let markov = EMPTY_MARKOV;
    let cumDelay = 300;

    COLD_STEPS.forEach((step, i) => {
      const delay = cumDelay;
      cumDelay += step.durationMs;

      const t1 = setTimeout(() => {
        setColdRevealedCount(i + 1);
        setColdElapsedMs(COLD_STEPS.slice(0, i + 1).reduce((s, st) => s + st.durationMs, 0));

        // Record Markov transition
        const from = COLD_MARKOV_PATH[i];
        const to = COLD_MARKOV_PATH[i + 1];
        if (from && to) {
          markov = recordTransition(markov, from, to);
          setMarkovState({ transitions: [...markov.transitions], visitCounts: { ...markov.visitCounts } });
          setFlashEdge({ from, to });
          const t2 = setTimeout(() => setFlashEdge(undefined), 350);
          timeoutsRef.current.push(t2);
        }
      }, delay);
      timeoutsRef.current.push(t1);
    });

    const tDone = setTimeout(() => setPhase('learning'), cumDelay + 600);
    timeoutsRef.current.push(tDone);

    return clearAll;
  }, [phase]);

  // Learning phase
  useEffect(() => {
    if (phase !== 'learning') return;

    clearAll();
    let markov = buildColdMarkov();
    const points: EmbeddingPoint[] = [];
    let cumDelay = 500;

    SYNTHETIC_TRACES.forEach((trace, i) => {
      const delay = cumDelay;
      cumDelay += 75;

      const t = setTimeout(() => {
        for (let j = 0; j < trace.length - 1; j++) {
          markov = recordTransition(markov, trace[j], trace[j + 1]);
        }
        setMarkovState({ transitions: [...markov.transitions], visitCounts: { ...markov.visitCounts } });

        // Flash last edge of trace
        const from = trace[trace.length - 2];
        const to = trace[trace.length - 1];
        setFlashEdge({ from, to });
        const tFlash = setTimeout(() => setFlashEdge(undefined), 200);
        timeoutsRef.current.push(tFlash);

        points.push(TRACE_EMBEDDINGS[i]);
        setEmbeddingPoints([...points]);
        setLearnProgress(i + 1);
      }, delay);
      timeoutsRef.current.push(t);
    });

    const tDone = setTimeout(() => setPhase('warm_ready'), cumDelay + 500);
    timeoutsRef.current.push(tDone);

    return clearAll;
  }, [phase]);

  // Warm run phase
  useEffect(() => {
    if (phase !== 'warm') return;

    clearAll();
    let markov: MarkovState = { ...markovState };
    let cumDelay = 300;

    WARM_STEPS.forEach((step, i) => {
      const delay = cumDelay;
      cumDelay += step.durationMs;

      const t1 = setTimeout(() => {
        setWarmRevealedCount(i + 1);
        setWarmElapsedMs(WARM_STEPS.slice(0, i + 1).reduce((s, st) => s + st.durationMs, 0));

        const from = WARM_MARKOV_PATH[i];
        const to = WARM_MARKOV_PATH[i + 1];
        if (from && to) {
          markov = recordTransition(markov, from, to);
          setMarkovState({ transitions: [...markov.transitions], visitCounts: { ...markov.visitCounts } });
          setFlashEdge({ from, to });
          const t2 = setTimeout(() => setFlashEdge(undefined), 350);
          timeoutsRef.current.push(t2);
        }
      }, delay);
      timeoutsRef.current.push(t1);
    });

    const tDone = setTimeout(() => setPhase('done'), cumDelay + 600);
    timeoutsRef.current.push(tDone);

    return clearAll;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => () => clearAll(), []);

  function handleReset() {
    clearAll();
    setPhase('idle');
    setColdRevealedCount(0);
    setWarmRevealedCount(0);
    setLearnProgress(0);
    setMarkovState(EMPTY_MARKOV);
    setEmbeddingPoints([]);
    setFlashEdge(undefined);
    setColdElapsedMs(0);
    setWarmElapsedMs(0);
  }

  const coldTokens = COLD_STEPS.slice(0, coldRevealedCount).reduce((s, st) => s + st.tokens, 0);
  const warmTokens = WARM_STEPS.slice(0, warmRevealedCount).reduce((s, st) => s + st.tokens, 0);
  const showPromptEmbed = phase !== 'idle';
  const warmHighlightPath = phase === 'warm' || phase === 'done' ? WARM_MARKOV_PATH : [];

  return (
    <Slide
      id="demo"
      step="06"
      label="Demo"
      title="COLD VS WARM AGENT."
      tone="elevated"
      innerClassName="max-w-7xl"
      className="!justify-start"
    >
      <p className="text-body-lg text-muted text-center mb-10 max-w-2xl mx-auto">
        Same prompt. Cold agent has no memory. Warm agent uses the hive —{' '}
        <span className="text-amber">{SAVINGS_PCT}% fewer tokens</span>.
      </p>

      {/* Prompt card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="panel p-5 mb-8 max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-min text-amber tracking-widest">INCOMING PROMPT</span>
          <AnimatePresence>
            {showPromptEmbed && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-min text-teal-light flex items-center gap-1"
              >
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  ●
                </motion.span>{' '}
                embedding generated → flight_booking cluster
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="font-mono text-body text-white leading-relaxed">
          &ldquo;{FLIGHT_PROMPT}&rdquo;
        </p>
      </motion.div>

      {/* START button */}
      <AnimatePresence>
        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex justify-center mb-10"
          >
            <button
              onClick={() => setPhase('cold')}
              className="hex-clip-btn bg-amber text-bg font-display text-2xl px-10 py-4 tracking-wider hover:shadow-[0_0_32px_rgba(245,166,35,0.4)] transition-all"
            >
              START DEMO ▶
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent panels */}
      <AnimatePresence>
        {phase !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-5 mb-6"
          >
            <AgentPanel
              label="COLD AGENT"
              sublabel="NO MEMORY · RUNNING BLIND"
              steps={COLD_STEPS}
              revealedCount={coldRevealedCount}
              tokens={coldTokens}
              elapsedMs={coldElapsedMs}
              isRunning={phase === 'cold'}
              variant="cold"
            />
            <AgentPanel
              label="WARM AGENT"
              sublabel="OPENHIVE ENABLED · MARKOV-GUIDED"
              steps={WARM_STEPS}
              revealedCount={warmRevealedCount}
              tokens={warmTokens}
              elapsedMs={warmElapsedMs}
              isRunning={phase === 'warm'}
              variant="warm"
              isLocked={phase !== 'warm' && phase !== 'done' && phase !== 'warm_ready'}
              onStart={phase === 'warm_ready' ? () => setPhase('warm') : undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learning phase progress */}
      <AnimatePresence>
        {(phase === 'learning' || (learnProgress > 0 && phase !== 'idle')) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="panel p-4 mb-6 max-w-3xl mx-auto overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-min text-amber tracking-widest">
                {phase === 'learning'
                  ? 'INGESTING HISTORICAL TRACES INTO MARKOV MODEL…'
                  : '✓ MARKOV MODEL UPDATED'}
              </span>
              <span className="font-mono text-min text-white tabular-nums">
                {learnProgress} / {SYNTHETIC_TRACES.length}
              </span>
            </div>
            <div className="h-1.5 bg-bg-3 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-amber rounded-full"
                animate={{ width: `${(learnProgress / SYNTHETIC_TRACES.length) * 100}%` }}
                transition={{ duration: 0.08 }}
              />
            </div>
            {phase !== 'learning' && learnProgress === SYNTHETIC_TRACES.length && (
              <p className="font-mono text-min text-teal-light">
                {SYNTHETIC_TRACES.length} traces learned — optimal path now dominant in graph
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom viz row */}
      <AnimatePresence>
        {phase !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-5 mb-6"
          >
            <div className="panel p-4">
              <h3 className="font-mono text-min text-amber tracking-widest mb-3">
                EMBEDDING SPACE
              </h3>
              <EmbeddingCloud points={embeddingPoints} showPrompt={showPromptEmbed} />
            </div>

            <div className="panel p-4">
              <h3 className="font-mono text-min text-amber tracking-widest mb-3">
                MARKOV GRAPH · FLIGHT BOOKING
              </h3>
              <RaceMarkovGraph
                state={markovState}
                flashEdge={flashEdge}
                highlightPath={warmHighlightPath}
                active
              />
              {markovState.transitions.length > 0 && (
                <p className="font-mono text-min text-muted mt-1 text-right">
                  {markovState.transitions.length} transitions recorded
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results card */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel p-6 max-w-3xl mx-auto"
          >
            <p className="font-mono text-min text-amber tracking-widest mb-5 text-center">
              RESULTS
            </p>

            <div className="grid grid-cols-3 gap-4 mb-5 text-center">
              <div>
                <p className="font-mono text-min text-muted mb-1">COLD TOKENS</p>
                <p className="font-display text-5xl text-white">{TOTAL_COLD_TOKENS.toLocaleString()}</p>
                <p className="font-mono text-min text-muted">{(TOTAL_COLD_MS / 1000).toFixed(1)}s</p>
              </div>
              <div>
                <p className="font-mono text-min text-amber tracking-wider mb-1">SAVINGS</p>
                <p className="font-display text-6xl text-amber">{SAVINGS_PCT}%</p>
                <p className="font-mono text-min text-teal-light">{SPEED_PCT}% faster</p>
              </div>
              <div>
                <p className="font-mono text-min text-muted mb-1">WARM TOKENS</p>
                <p className="font-display text-5xl text-teal-light">{TOTAL_WARM_TOKENS.toLocaleString()}</p>
                <p className="font-mono text-min text-muted">{(TOTAL_WARM_MS / 1000).toFixed(1)}s</p>
              </div>
            </div>

            {/* Token bars */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-min text-muted w-10 text-right">COLD</span>
                <div className="flex-1 h-3 bg-bg-3 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-dim rounded-full" style={{ width: '100%' }} />
                </div>
                <span className="font-mono text-min text-muted w-16">{TOTAL_COLD_TOKENS.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-min text-muted w-10 text-right">WARM</span>
                <div className="flex-1 h-3 bg-bg-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: `${(TOTAL_WARM_TOKENS / TOTAL_COLD_TOKENS) * 100}%` }}
                    transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--teal-light)' }}
                  />
                </div>
                <span className="font-mono text-min text-teal-light w-16">{TOTAL_WARM_TOKENS.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="font-mono text-min text-amber border border-amber-dim px-6 py-2 rounded hover:bg-[var(--amber-glow)] transition-colors"
              >
                ↺ RESET DEMO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Slide>
  );
}
