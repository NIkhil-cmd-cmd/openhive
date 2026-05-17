import { memo, type ReactNode } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { HiveNodeData } from './types';

function NodeShell({
  children,
  active,
  dimmed,
  accent = 'amber',
  className = '',
  minWidth = 160,
}: {
  children: ReactNode;
  active?: boolean;
  dimmed?: boolean;
  accent?: 'amber' | 'teal';
  className?: string;
  minWidth?: number;
}) {
  const border =
    accent === 'teal'
      ? active
        ? 'border-teal-light shadow-[0_0_24px_rgba(20,168,174,0.25)]'
        : 'border-teal/40'
      : active
        ? 'border-amber shadow-[0_0_24px_var(--amber-glow)]'
        : 'border-border';

  return (
    <div
      className={`rounded-lg border bg-bg-2 px-4 py-3 transition-all duration-300 ${border} ${
        dimmed ? 'opacity-40' : 'opacity-100'
      } ${className}`}
      style={{ minWidth }}
    >
      {children}
    </div>
  );
}

export const AgentNode = memo(({ data }: NodeProps) => {
  const d = data as HiveNodeData;
  return (
    <>
      <Handle type="source" position={Position.Right} className="!bg-amber !w-2 !h-2 !border-0" />
      <NodeShell active={d.active} dimmed={d.dimmed} minWidth={210}>
        <div className="flex items-start gap-3">
          <span className="text-lg leading-none">{d.icon}</span>
          <div>
            <p className="font-mono text-[10px] text-amber">{d.label}</p>
            <p className="font-mono text-[11px] text-muted mt-1 leading-snug">{d.prompt}</p>
          </div>
        </div>
      </NodeShell>
    </>
  );
});

export const LayerNode = memo(({ data }: NodeProps) => {
  const d = data as HiveNodeData;
  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-amber !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-amber !w-2 !h-2 !border-0" />
      <NodeShell active={d.active} dimmed={d.dimmed} minWidth={200}>
        <p className="font-mono text-[10px] text-amber tracking-wide">{d.label}</p>
        {d.sublabel && <p className="font-mono text-[9px] text-muted mt-1">{d.sublabel}</p>}
        {d.vector && (
          <p className="font-mono text-[10px] text-white mt-2 bg-bg-3 rounded px-2 py-1">{d.vector}</p>
        )}
        {d.vector && <p className="font-mono text-[9px] text-teal-light mt-1">1536-d vector</p>}
      </NodeShell>
    </>
  );
});

export const HiveMemoryNode = memo(({ data }: NodeProps) => {
  const d = data as HiveNodeData;
  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-amber !w-2.5 !h-2.5 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-amber !w-2.5 !h-2.5 !border-0" />
      <Handle
        type="target"
        position={Position.Bottom}
        id="writeback-in"
        className="!bg-teal-light !w-2 !h-2 !border-0"
      />
      <div
        className={`relative flex flex-col items-center justify-center transition-opacity duration-300 ${
          d.dimmed ? 'opacity-40' : ''
        }`}
      >
        <div
          className={`absolute w-32 h-32 rounded-full blur-2xl transition-opacity ${
            d.active ? 'opacity-100' : 'opacity-40'
          }`}
          style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.35) 0%, transparent 70%)' }}
        />
        <svg width="120" height="130" viewBox="0 0 120 130" className="relative">
          <polygon
            points="60,4 116,32 116,86 60,126 4,86 4,32"
            fill="rgba(245,166,35,0.14)"
            stroke="var(--amber)"
            strokeWidth={d.active ? 2.5 : 1.5}
          />
          <text x="60" y="64" textAnchor="middle" fill="var(--amber)" fontSize="11" fontFamily="DM Mono, monospace">
            HIVEMIND
          </text>
          <text x="60" y="80" textAnchor="middle" fill="var(--muted)" fontSize="8" fontFamily="DM Mono, monospace">
            MEMORY
          </text>
        </svg>
        <p className="font-mono text-[9px] text-muted -mt-1">Supabase + pgvector</p>
      </div>
    </>
  );
});

const MARKOV_EDGES = [
  { from: 'START', to: 'search_flights', primary: true },
  { from: 'search_flights', to: 'select_flight', primary: true },
  { from: 'select_flight', to: 'payment', primary: true },
  { from: 'payment', to: 'END', primary: true },
  { from: 'START', to: 'check_price', primary: false },
  { from: 'check_price', to: 'show_options', primary: false },
  { from: 'show_options', to: 'payment', primary: false },
];

const MARKOV_POS: Record<string, { x: number; y: number }> = {
  START: { x: 24, y: 30 },
  search_flights: { x: 98, y: 30 },
  select_flight: { x: 172, y: 30 },
  payment: { x: 246, y: 30 },
  END: { x: 318, y: 30 },
  check_price: { x: 98, y: 78 },
  show_options: { x: 172, y: 78 },
};

export const MarkovNode = memo(({ data }: NodeProps) => {
  const d = data as HiveNodeData;
  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-amber !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-amber !w-2 !h-2 !border-0" />
      <div
        className={`rounded-lg border bg-bg-2 p-4 transition-all duration-300 ${
          d.active ? 'border-amber shadow-[0_0_24px_var(--amber-glow)]' : 'border-border'
        } ${d.dimmed ? 'opacity-40' : ''}`}
        style={{ minWidth: 360 }}
      >
        <p className="font-display text-lg text-white">MARKOV ROUTER</p>
        <p className="font-mono text-[9px] text-muted mb-3">Predict tool sequence from intent bucket</p>
        <svg width="340" height="96" viewBox="0 0 340 96">
          {MARKOV_EDGES.map((e) => {
            const a = MARKOV_POS[e.from];
            const b = MARKOV_POS[e.to];
            return (
              <line
                key={`${e.from}-${e.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={e.primary ? 'var(--amber)' : 'var(--muted)'}
                strokeWidth={e.primary ? 2 : 1}
                strokeDasharray={e.primary ? undefined : '4 3'}
                opacity={e.primary ? 0.75 : 0.3}
              />
            );
          })}
          {Object.entries(MARKOV_POS).map(([id, p]) => (
            <g key={id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={12}
                fill="var(--bg-3)"
                stroke={p.y < 50 ? 'var(--amber)' : 'var(--muted)'}
              />
              <text
                x={p.x}
                y={p.y + 24}
                textAnchor="middle"
                fill="var(--muted)"
                fontSize="7"
                fontFamily="DM Mono, monospace"
              >
                {id}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </>
  );
});

export const KnnNode = memo(({ data }: NodeProps) => {
  const d = data as HiveNodeData;
  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-amber !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-amber !w-2 !h-2 !border-0" />
      <NodeShell active={d.active} dimmed={d.dimmed} minWidth={220}>
        <p className="font-mono text-[10px] text-amber">KNN RETRIEVAL</p>
        <p className="font-mono text-[9px] text-muted mb-2">top-k across ALL agents</p>
        <ul className="space-y-1">
          {d.knnItems?.map((item) => (
            <li key={item.rank} className="font-mono text-[9px] text-white/85">
              <span className="text-amber">{item.rank}.</span> {item.score.toFixed(2)} — {item.label}
            </li>
          ))}
        </ul>
      </NodeShell>
    </>
  );
});

export const ExecuteNode = memo(({ data }: NodeProps) => {
  const d = data as HiveNodeData;
  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-amber !w-2 !h-2 !border-0" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="to-writeback"
        className="!bg-teal-light !w-2 !h-2 !border-0"
      />
      <NodeShell active={d.active} dimmed={d.dimmed} minWidth={400}>
        <p className="font-display text-base text-white mb-3">EXECUTE TOOL PATH</p>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {d.execSteps?.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="rounded border border-border bg-bg-3 px-3 py-2 text-center min-w-[76px]">
                <span className="text-base block">{step.icon}</span>
                <span className="font-mono text-[8px] text-muted">{step.label}</span>
              </div>
              {i < (d.execSteps?.length ?? 0) - 1 && <span className="text-amber">→</span>}
            </div>
          ))}
        </div>
      </NodeShell>
    </>
  );
});

export const WritebackNode = memo(({ data }: NodeProps) => {
  const d = data as HiveNodeData;
  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-teal-light !w-2 !h-2 !border-0" />
      <Handle
        type="source"
        position={Position.Top}
        id="to-hive"
        className="!bg-teal-light !w-2 !h-2 !border-0"
      />
      <NodeShell active={d.active} dimmed={d.dimmed} accent="teal" minWidth={170}>
        <p className="font-mono text-[11px] text-teal-light text-center">WRITE BACK</p>
        <p className="font-mono text-[9px] text-muted text-center mt-1">learning loop</p>
        <p className="font-mono text-[8px] text-muted text-center mt-2">vector · path · outcome</p>
      </NodeShell>
    </>
  );
});

export const nodeTypes = {
  agent: AgentNode,
  layer: LayerNode,
  hive: HiveMemoryNode,
  knn: KnnNode,
  markov: MarkovNode,
  execute: ExecuteNode,
  writeback: WritebackNode,
};
