import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLUSTER_DEFS, PROMPT_EMBEDDING, type EmbeddingPoint } from './raceData';

interface EmbeddingCloudProps {
  points: EmbeddingPoint[];
  showPrompt: boolean;
}

const W = 300;
const H = 220;
const SCALE = 2.0;
const CX = W / 2;
const CY = H / 2;

function toSvg(x: number, y: number) {
  return { sx: CX + x * SCALE, sy: CY + y * SCALE };
}

export function EmbeddingCloud({ points, showPrompt }: EmbeddingCloudProps) {
  const clusterBubbles = useMemo(() =>
    Object.entries(CLUSTER_DEFS).map(([key, def]) => {
      const { sx, sy } = toSvg(def.x, def.y);
      return { key, sx, sy, color: def.color, label: def.label };
    }), []);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        className="bg-bg-2 border border-border rounded-lg overflow-hidden"
      >
        {/* Cluster background blobs */}
        {clusterBubbles.map((c) => (
          <ellipse
            key={c.key}
            cx={c.sx}
            cy={c.sy}
            rx={36}
            ry={28}
            fill={c.color}
            fillOpacity={0.04}
            stroke={c.color}
            strokeOpacity={0.12}
            strokeWidth={1}
          />
        ))}

        {/* Cluster labels */}
        {clusterBubbles.map((c) => (
          <text
            key={`lbl-${c.key}`}
            x={c.sx}
            y={c.sy - 32}
            textAnchor="middle"
            fontSize={7}
            fill={c.color}
            fillOpacity={0.5}
            fontFamily="DM Mono, Courier New, monospace"
          >
            {c.label.replace('_', '_\n')}
          </text>
        ))}

        {/* Trace embedding points */}
        <AnimatePresence>
          {points.map((pt) => {
            const { sx, sy } = toSvg(pt.x, pt.y);
            return (
              <motion.circle
                key={pt.id}
                cx={sx}
                cy={sy}
                r={3}
                fill={pt.color}
                fillOpacity={0.7}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: 3, opacity: 0.7 }}
                transition={{ duration: 0.25 }}
              />
            );
          })}
        </AnimatePresence>

        {/* Prompt embedding — pulsing amber star */}
        {showPrompt && (() => {
          const { sx, sy } = toSvg(PROMPT_EMBEDDING.x, PROMPT_EMBEDDING.y);
          return (
            <g>
              <motion.circle
                cx={sx}
                cy={sy}
                r={10}
                fill="var(--amber)"
                fillOpacity={0}
                stroke="var(--amber)"
                strokeWidth={1}
                animate={{ r: [8, 18], fillOpacity: [0.15, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
              />
              <circle cx={sx} cy={sy} r={5} fill="var(--amber)" />
              <text
                x={sx + 8}
                y={sy - 8}
                fontSize={7}
                fill="var(--amber)"
                fontFamily="DM Mono, Courier New, monospace"
              >
                THIS PROMPT
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-2">
        {clusterBubbles.map((c) => (
          <span key={c.key} className="flex items-center gap-1 font-mono text-[9px] text-muted">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: c.color }} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
