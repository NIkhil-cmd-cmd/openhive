import { memo, type ReactNode } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { HiveNodeData } from './types';

const SHELL = 'px-5 py-4';

function NodeShell({
  children,
  active,
  dimmed,
  accent = 'amber',
  className = '',
  minWidth = 280,
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
      className={`rounded-xl border bg-bg-2 ${SHELL} transition-all duration-300 ${border} ${
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
      <Handle type="source" position={Position.Right} className="!bg-amber !w-3 !h-3 !border-0" />
      <NodeShell active={d.active} dimmed={d.dimmed} minWidth={300}>
        <div className="flex items-start gap-4">
          <span className="text-3xl leading-none">{d.icon}</span>
          <div>
            <p className="font-mono text-label text-amber">{d.label}</p>
            <p className="font-mono text-min text-muted mt-2 leading-snug">{d.prompt}</p>
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
      <Handle type="target" position={Position.Left} className="!bg-amber !w-3 !h-3 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-amber !w-3 !h-3 !border-0" />
      <NodeShell active={d.active} dimmed={d.dimmed} minWidth={300}>
        <p className="font-mono text-label text-amber tracking-wide">{d.label}</p>
        {d.sublabel && <p className="font-mono text-min text-muted mt-2">{d.sublabel}</p>}
        {d.vector && (
          <p className="font-mono text-min text-white mt-3 bg-bg-3 rounded-lg px-3 py-2">{d.vector}</p>
        )}
        {d.vector && <p className="font-mono text-min text-teal-light mt-2">1536-d vector</p>}
      </NodeShell>
    </>
  );
});

export const HiveMemoryNode = memo(({ data }: NodeProps) => {
  const d = data as HiveNodeData;
  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-amber !w-3 !h-3 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-amber !w-3 !h-3 !border-0" />
      <Handle
        type="target"
        position={Position.Bottom}
        id="writeback-in"
        className="!bg-teal-light !w-3 !h-3 !border-0"
      />
      <div
        className={`relative flex flex-col items-center justify-center transition-opacity duration-300 ${
          d.dimmed ? 'opacity-40' : ''
        }`}
      >
        <div
          className={`absolute w-40 h-40 rounded-full blur-2xl transition-opacity ${
            d.active ? 'opacity-100' : 'opacity-40'
          }`}
          style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.35) 0%, transparent 70%)' }}
        />
        <svg width="160" height="170" viewBox="0 0 120 130" className="relative">
          <polygon
            points="60,4 116,32 116,86 60,126 4,86 4,32"
            fill="rgba(245,166,35,0.14)"
            stroke="var(--amber)"
            strokeWidth={d.active ? 2.5 : 1.5}
          />
          <text x="60" y="64" textAnchor="middle" fill="var(--amber)" fontSize="14" fontFamily="DM Mono, monospace">
            OPENHIVE
          </text>
          <text x="60" y="82" textAnchor="middle" fill="var(--muted)" fontSize="11" fontFamily="DM Mono, monospace">
            MEMORY
          </text>
        </svg>
        <p className="font-mono text-min text-muted mt-1">Supabase + pgvector</p>
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
      <Handle type="target" position={Position.Left} className="!bg-amber !w-3 !h-3 !border-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-amber !w-3 !h-3 !border-0" />
      <div
        className={`rounded-xl border bg-bg-2 p-5 transition-all duration-300 ${
          d.active ? 'border-amber shadow-[0_0_24px_var(--amber-glow)]' : 'border-border'
        } ${d.dimmed ? 'opacity-40' : ''}`}
        style={{ minWidth: 440 }}
      >
        <p className="font-display text-3xl text-white">MARKOV ROUTER</p>
        <p className="font-mono text-min text-muted mb-4 mt-1">Tool sequence from intent</p>
        <svg width="400" height="110" viewBox="0 0 340 96">
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
                strokeWidth={e.primary ? 2.5 : 1.5}
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
                r={14}
                fill="var(--bg-3)"
                stroke={p.y < 50 ? 'var(--amber)' : 'var(--muted)'}
              />
              <text
                x={p.x}
                y={p.y + 26}
                textAnchor="middle"
                fill="var(--muted)"
                fontSize="9"
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
      <Handle type="target" position={Position.Left} className="!bg-amber !w-3 !h-3 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-amber !w-3 !h-3 !border-0" />
      <NodeShell active={d.active} dimmed={d.dimmed} minWidth={300}>
        <p className="font-mono text-label text-amber">KNN RETRIEVAL</p>
        <p className="font-mono text-min text-muted mb-3">top-k · all agents</p>
        <ul className="space-y-2">
          {d.knnItems?.map((item) => (
            <li key={item.rank} className="font-mono text-min text-white/90">
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
      <Handle type="target" position={Position.Top} className="!bg-amber !w-3 !h-3 !border-0" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="to-writeback"
        className="!bg-teal-light !w-3 !h-3 !border-0"
      />
      <NodeShell active={d.active} dimmed={d.dimmed} minWidth={480}>
        <p className="font-display text-3xl text-white mb-4">EXECUTE</p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {d.execSteps?.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className="rounded-lg border border-border bg-bg-3 px-4 py-3 text-center min-w-[100px]">
                <span className="text-2xl block">{step.icon}</span>
                <span className="font-mono text-min text-muted mt-1 block">{step.label}</span>
              </div>
              {i < (d.execSteps?.length ?? 0) - 1 && <span className="text-amber text-2xl">→</span>}
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
      <Handle type="target" position={Position.Top} className="!bg-teal-light !w-3 !h-3 !border-0" />
      <Handle
        type="source"
        position={Position.Top}
        id="to-hive"
        className="!bg-teal-light !w-3 !h-3 !border-0"
      />
      <NodeShell active={d.active} dimmed={d.dimmed} accent="teal" minWidth={220}>
        <p className="font-mono text-label text-teal-light text-center">WRITE BACK</p>
        <p className="font-mono text-min text-muted text-center mt-2">learning loop</p>
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
