import { AnimatePresence, motion } from 'framer-motion';
import type { ToolStep } from './raceData';

interface AgentPanelProps {
  label: string;
  sublabel: string;
  steps: ToolStep[];
  revealedCount: number;
  tokens: number;
  elapsedMs: number;
  isRunning: boolean;
  variant: 'cold' | 'warm';
  isLocked?: boolean;
  onStart?: () => void;
}

function formatElapsed(ms: number): string {
  if (ms === 0) return '0.0s';
  return `${(ms / 1000).toFixed(1)}s`;
}

export function AgentPanel({
  label,
  sublabel,
  steps,
  revealedCount,
  tokens,
  elapsedMs,
  isRunning,
  variant,
  isLocked,
  onStart,
}: AgentPanelProps) {
  const accentColor = variant === 'warm' ? 'var(--teal-light)' : 'var(--amber)';
  const accentClass = variant === 'warm' ? 'text-teal-light' : 'text-amber';
  const borderClass = variant === 'warm' ? 'border-teal' : 'border-amber-dim';
  const revealedSteps = steps.slice(0, revealedCount);
  const wastedCount = revealedSteps.filter((s) => s.isWasted).length;
  const isDone = revealedCount >= steps.length && revealedCount > 0;

  return (
    <div
      className={`panel p-5 flex flex-col min-h-[480px] border ${isDone || isRunning ? borderClass : 'border-border'} transition-colors duration-500`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-3xl text-white tracking-wider">{label}</h3>
          <p className="font-mono text-min" style={{ color: accentColor }}>
            {sublabel}
          </p>
        </div>
        <div className="text-right">
          {isRunning && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="font-mono text-min text-amber block"
            >
              ● RUNNING
            </motion.span>
          )}
          {isDone && (
            <span className={`font-mono text-min ${accentClass} block`}>✓ DONE</span>
          )}
          {isLocked && !onStart && (
            <span className="font-mono text-min text-muted block">⊘ WAITING</span>
          )}
        </div>
      </div>

      {/* Step list */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[320px] pr-1">
        <AnimatePresence initial={false}>
          {revealedSteps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: variant === 'warm' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-lg px-3 py-2.5 font-mono text-min border ${
                step.isWasted
                  ? 'bg-[rgba(245,166,35,0.06)] border-amber-dim'
                  : 'bg-bg-3 border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <span
                  className={`font-bold tracking-wide ${
                    step.isWasted ? 'text-amber-dim' : accentClass
                  }`}
                >
                  {step.isWasted && '⚠ '}
                  {step.tool}
                </span>
                <span className="text-muted shrink-0">+{step.tokens} tok</span>
              </div>
              <p className={`${step.isWasted ? 'text-muted' : 'text-white'} leading-tight`}>
                {step.description}
              </p>
              {i === revealedCount - 1 && isRunning && (
                <motion.div
                  className="h-0.5 mt-1.5 rounded-full"
                  style={{ background: accentColor }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: step.durationMs / 1000, ease: 'linear' }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {revealedCount === 0 && !isLocked && !onStart && (
          <p className="font-mono text-min text-muted text-center mt-8">Starting…</p>
        )}

        {isLocked && !onStart && revealedCount === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 mt-12">
            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-3 opacity-40">
              <span className="text-2xl">⊘</span>
            </div>
            <p className="font-mono text-min text-muted text-center">
              Waiting for cold run to complete…
            </p>
          </div>
        )}
      </div>

      {/* Start warm run CTA */}
      {onStart && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onStart}
          className="w-full mt-4 font-display text-xl text-bg py-3 rounded tracking-wider transition-all hover:brightness-110"
          style={{ background: accentColor }}
        >
          START WARM RUN ▶
        </motion.button>
      )}

      {/* Stats footer */}
      {(isDone || isRunning || revealedCount > 0) && (
        <div className="mt-4 pt-3 border-t border-border grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="font-mono text-min text-muted">STEPS</p>
            <p className={`font-display text-2xl ${accentClass}`}>
              {revealedCount}
              {isDone && <span className="font-mono text-min text-muted">/{steps.length}</span>}
            </p>
          </div>
          <div className="text-center">
            <p className="font-mono text-min text-muted">TOKENS</p>
            <p className={`font-display text-2xl ${accentClass}`}>
              {tokens.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="font-mono text-min text-muted">TIME</p>
            <p className={`font-display text-2xl ${accentClass}`}>{formatElapsed(elapsedMs)}</p>
          </div>
        </div>
      )}

      {isDone && wastedCount > 0 && (
        <p className="font-mono text-min text-amber-dim mt-2 text-center">
          ⚠ {wastedCount} wasted call{wastedCount > 1 ? 's' : ''} detected
        </p>
      )}
    </div>
  );
}
