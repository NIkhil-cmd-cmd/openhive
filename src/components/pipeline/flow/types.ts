export type HiveNodeData = {
  label: string;
  sublabel?: string;
  active?: boolean;
  dimmed?: boolean;
  prompt?: string;
  icon?: string;
  vector?: string;
  knnItems?: { rank: number; score: number; label: string }[];
  execSteps?: { icon: string; label: string }[];
};

export type FlowPhase =
  | 'idle'
  | 'agent-1'
  | 'agent-2'
  | 'agent-3'
  | 'embed'
  | 'hive'
  | 'knn'
  | 'markov'
  | 'execute'
  | 'writeback';

export type PathMode = 'all' | 'read' | 'write';

export const PHASE_ORDER: FlowPhase[] = [
  'agent-1',
  'agent-2',
  'agent-3',
  'embed',
  'hive',
  'knn',
  'markov',
  'execute',
  'writeback',
];

export const KNN_ITEMS = [
  { rank: 1, score: 0.92, label: 'flight booking intent' },
  { rank: 2, score: 0.89, label: 'travel search' },
  { rank: 3, score: 0.87, label: 'itinerary change' },
  { rank: 4, score: 0.84, label: 'seat selection' },
  { rank: 5, score: 0.81, label: 'payment flow' },
];

export const EXEC_STEPS = [
  { icon: '🔍', label: 'search_flights' },
  { icon: '✈', label: 'select_flight' },
  { icon: '💳', label: 'payment' },
  { icon: '✓', label: 'COMPLETE' },
];

export const NODE_INFO: Record<string, { title: string; body: string }> = {
  'agent-1': { title: 'Agent 1', body: 'Voice agent prompt enters the shared pipeline.' },
  'agent-2': { title: 'Agent 2', body: 'All agents converge — no isolated memory silos.' },
  'agent-3': { title: 'Agent 3', body: 'Every prompt feeds the same hive.' },
  embed: { title: 'Embedding', body: 'text-embedding-3-small → 1536-d vector.' },
  hive: { title: 'OpenHive Memory', body: 'Shared Supabase pgvector store for all agents.' },
  knn: { title: 'KNN Retrieval', body: 'Top-k similar prompts across all agents → intent bucket.' },
  markov: { title: 'Markov Router', body: 'Predicts highest-probability tool sequence.' },
  execute: { title: 'Execute', body: 'Runs the predicted tool path.' },
  writeback: { title: 'Write-back', body: 'Stores experience — instantly available to every agent.' },
};
