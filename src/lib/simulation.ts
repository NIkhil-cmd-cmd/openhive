import { randomEmbedding } from './knn';
import { initMarkovState, recordTransition, type MarkovState } from './markov';

export const AGENT_IDS = ['AGENT-A', 'AGENT-B', 'AGENT-C'] as const;

export type BucketKey = 'smart_home' | 'information' | 'scheduling';

export interface BucketConfig {
  prompts: string[];
  tools: string[];
  markovPath: string[];
}

export const BUCKETS: Record<BucketKey, BucketConfig> = {
  smart_home: {
    prompts: [
      'turn off the kitchen lights',
      'set thermostat to 70 degrees',
      'lock the front door',
      'dim the bedroom lights to 40%',
    ],
    tools: ['smart_home_control', 'confirm_action'],
    markovPath: ['START', 'smart_home_control', 'confirm_action', 'END'],
  },
  information: {
    prompts: [
      "what's the weather in Montreal?",
      'search for best coffee shops near me',
      'what time does the pharmacy close?',
    ],
    tools: ['weather_fetch', 'web_search'],
    markovPath: ['START', 'web_search', 'weather_fetch', 'END'],
  },
  scheduling: {
    prompts: [
      'add a meeting at 3pm tomorrow',
      'remind me to call mom on Friday',
      "what's on my calendar this week?",
    ],
    tools: ['calendar_read', 'calendar_write', 'set_reminder'],
    markovPath: ['START', 'calendar_read', 'calendar_write', 'END'],
  },
};

export const BUCKET_COLORS: Record<string, string> = {
  smart_home: 'var(--amber)',
  information: 'var(--teal-light)',
  scheduling: 'var(--white)',
  other: 'var(--muted)',
};

export interface AgentEvent {
  id: string;
  agentId: string;
  prompt: string;
  bucket: BucketKey;
  route: string[];
  confidence: number;
  tokensSaved: number;
  timestamp: number;
  edgeFlash?: { from: string; to: string };
}

export interface MemoryPoint {
  id: string;
  x: number;
  y: number;
  bucket: BucketKey;
  prompt: string;
  agentId: string;
  confidence: number;
}

export interface SimulationState {
  events: AgentEvent[];
  memories: MemoryPoint[];
  markovByBucket: Record<BucketKey, MarkovState>;
  stats: {
    memoryCount: number;
    agentCount: number;
    bucketCount: number;
    tokensSavedPct: number;
  };
  selectedBucket: BucketKey;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function project2D(embedding: number[]): { x: number; y: number } {
  const x = embedding.slice(0, 8).reduce((s, v) => s + v, 0) * 80;
  const y = embedding.slice(8, 16).reduce((s, v) => s + v, 0) * 80;
  return { x, y };
}

export function createInitialState(): SimulationState {
  const markovByBucket = {} as Record<BucketKey, MarkovState>;
  for (const key of Object.keys(BUCKETS) as BucketKey[]) {
    markovByBucket[key] = initMarkovState([BUCKETS[key].markovPath]);
  }
  return {
    events: [],
    memories: [],
    markovByBucket,
    stats: {
      memoryCount: 12,
      agentCount: 3,
      bucketCount: 3,
      tokensSavedPct: 34,
    },
    selectedBucket: 'smart_home',
  };
}

export function tickSimulation(state: SimulationState): SimulationState {
  const agentId = randomItem([...AGENT_IDS]);
  const bucket = randomItem(Object.keys(BUCKETS) as BucketKey[]);
  const config = BUCKETS[bucket];
  const prompt = randomItem(config.prompts);
  const memoryCount = state.stats.memoryCount + 1;
  const confidence = Math.min(
    92,
    Math.max(40, 40 + Math.floor(memoryCount / 3) + Math.floor(Math.random() * 15))
  );
  const tokensSaved = Math.floor(confidence * 4 + Math.random() * 80);
  const embedding = randomEmbedding(32);
  const { x, y } = project2D(embedding);

  const path = config.markovPath;
  let markov = state.markovByBucket[bucket];
  for (let i = 0; i < path.length - 1; i++) {
    markov = recordTransition(markov, path[i], path[i + 1]);
  }

  const edgeFlash =
    path.length >= 2
      ? { from: path[path.length - 2], to: path[path.length - 1] }
      : undefined;

  const event: AgentEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    agentId,
    prompt,
    bucket,
    route: config.tools,
    confidence,
    tokensSaved,
    timestamp: Date.now(),
    edgeFlash,
  };

  const memory: MemoryPoint = {
    id: `mem-${Date.now()}`,
    x,
    y,
    bucket,
    prompt,
    agentId,
    confidence,
  };

  const tokensSavedPct = Math.min(
    89,
    Math.floor(30 + memoryCount * 0.15 + Math.random() * 5)
  );

  return {
    ...state,
    events: [event, ...state.events].slice(0, 20),
    memories: [...state.memories, memory].slice(-80),
    markovByBucket: { ...state.markovByBucket, [bucket]: markov },
    stats: {
      memoryCount,
      agentCount: 3,
      bucketCount: 3,
      tokensSavedPct,
    },
  };
}

export function resetSimulation(): SimulationState {
  return createInitialState();
}
