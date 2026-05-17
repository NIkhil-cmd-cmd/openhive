import type { Edge, Node } from '@xyflow/react';
import type { FlowPhase, HiveNodeData, PathMode } from './types';
import { EXEC_STEPS, KNN_ITEMS, PHASE_ORDER } from './types';

const AGENTS = [
  { id: 'agent-1', label: 'Agent 1', prompt: 'Book a flight to NYC', icon: '✈' },
  { id: 'agent-2', label: 'Agent 2', prompt: "What's the weather in Paris?", icon: '🌤' },
  { id: 'agent-3', label: 'Agent 3', prompt: 'Send follow up email to client', icon: '✉' },
];

function phaseIndex(phase: FlowPhase): number {
  if (phase === 'idle') return -1;
  return PHASE_ORDER.indexOf(phase);
}

const READ_IDS = ['agent-1', 'agent-2', 'agent-3', 'embed', 'hive', 'knn', 'markov'];
const WRITE_IDS = ['execute', 'writeback', 'hive'];

function isLit(nodeId: string, current: FlowPhase, mode: PathMode): boolean {
  if (current === 'idle') return mode === 'all';
  const idx = phaseIndex(current);
  const nodeIdx = PHASE_ORDER.indexOf(nodeId as FlowPhase);
  if (nodeIdx < 0) return false;
  if (mode === 'read') return READ_IDS.includes(nodeId) && nodeIdx <= idx;
  if (mode === 'write') return WRITE_IDS.includes(nodeId) && (nodeId !== 'hive' ? nodeIdx <= idx : idx >= phaseIndex('writeback'));
  return nodeIdx <= idx;
}

function isDimmed(nodeId: string, current: FlowPhase, mode: PathMode): boolean {
  if (current === 'idle' && mode === 'all') return false;
  return !isLit(nodeId, current, mode);
}

export function buildNodes(current: FlowPhase, mode: PathMode): Node<HiveNodeData>[] {
  const lit = (id: string) => isLit(id, current, mode);
  const dim = (id: string) => isDimmed(id, current, mode);

  return [
    ...AGENTS.map((a, i) => ({
      id: a.id,
      type: 'agent' as const,
      position: { x: 0, y: i * 150 },
      data: {
        label: a.label,
        prompt: a.prompt,
        icon: a.icon,
        active: lit(a.id) || current === a.id,
        dimmed: dim(a.id),
      },
    })),
    {
      id: 'embed',
      type: 'layer',
      position: { x: 340, y: 120 },
      data: {
        label: 'EMBEDDING LAYER',
        sublabel: 'text-embedding-3-small',
        vector: '[0.12, -0.37, 0.84, …]',
        active: lit('embed'),
        dimmed: dim('embed'),
      },
    },
    {
      id: 'hive',
      type: 'hive',
      position: { x: 620, y: 90 },
      data: { label: 'OPENHIVE MEMORY', active: lit('hive'), dimmed: dim('hive') },
    },
    {
      id: 'knn',
      type: 'knn',
      position: { x: 860, y: 110 },
      data: {
        label: 'KNN',
        knnItems: KNN_ITEMS,
        active: lit('knn'),
        dimmed: dim('knn'),
      },
    },
    {
      id: 'markov',
      type: 'markov',
      position: { x: 1180, y: 50 },
      data: { label: 'Markov', active: lit('markov'), dimmed: dim('markov') },
    },
    {
      id: 'execute',
      type: 'execute',
      position: { x: 1100, y: 500 },
      data: {
        label: 'Execute',
        execSteps: EXEC_STEPS,
        active: lit('execute'),
        dimmed: dim('execute'),
      },
    },
    {
      id: 'writeback',
      type: 'writeback',
      position: { x: 640, y: 520 },
      data: { label: 'Writeback', active: lit('writeback'), dimmed: dim('writeback') },
    },
  ];
}

function edge(
  id: string,
  source: string,
  target: string,
  opts: { animated?: boolean; stroke?: string; dashed?: boolean; sourceHandle?: string; targetHandle?: string }
): Edge {
  return {
    id,
    source,
    target,
    sourceHandle: opts.sourceHandle,
    targetHandle: opts.targetHandle,
    animated: opts.animated,
    style: {
      stroke: opts.stroke ?? 'var(--amber)',
      strokeWidth: 3,
      strokeDasharray: opts.dashed ? '8 6' : undefined,
    },
  };
}

export function buildEdges(current: FlowPhase, mode: PathMode): Edge[] {
  const animateRead = current !== 'idle' && mode !== 'write';
  const animateWrite = current !== 'idle' && (mode === 'write' || mode === 'all');

  return [
    edge('a1-embed', 'agent-1', 'embed', { animated: animateRead }),
    edge('a2-embed', 'agent-2', 'embed', { animated: animateRead }),
    edge('a3-embed', 'agent-3', 'embed', { animated: animateRead }),
    edge('embed-hive', 'embed', 'hive', { animated: animateRead }),
    edge('hive-knn', 'hive', 'knn', { animated: animateRead }),
    edge('knn-markov', 'knn', 'markov', { animated: animateRead }),
    edge('markov-exec', 'markov', 'execute', { animated: animateRead }),
    edge('exec-wb', 'execute', 'writeback', {
      animated: animateWrite,
      sourceHandle: 'to-writeback',
    }),
    edge('wb-hive', 'writeback', 'hive', {
      animated: animateWrite,
      stroke: 'var(--teal-light)',
      dashed: true,
      sourceHandle: 'to-hive',
      targetHandle: 'writeback-in',
    }),
  ];
}
