import { recordTransition, initMarkovState, type MarkovState } from '../../lib/markov';

export const REAL_ESTATE_PROMPT =
  `Hi there, I saw your ad online. I'm thinking about maybe buying a house sometime soon. I'm not totally sure where I want to live yet — maybe Pittsburgh or somewhere nearby? I don't have a firm budget in mind, somewhere between $300k and $600k I guess. My wife and I have two young kids so schools matter. No huge rush though.`;

export interface ToolStep {
  id: string;
  tool: string;
  description: string;
  tokens: number;
  durationMs: number;
  isWasted?: boolean;
}

export const COLD_STEPS: ToolStep[] = [
  { id: 'c1',  tool: 'ask_clarifying_question', description: 'No prior context — asking what they want',         tokens: 320, durationMs: 1200, isWasted: true },
  { id: 'c2',  tool: 'ask_clarifying_question', description: 'Still unclear — asking again',                      tokens: 280, durationMs: 1100, isWasted: true },
  { id: 'c3',  tool: 'extract_requirements',    description: 'Extracting buyer requirements from conversation',   tokens: 410, durationMs: 1000 },
  { id: 'c4',  tool: 'qualify_lead',            description: 'Checking lead quality score',                       tokens: 380, durationMs:  900 },
  { id: 'c5',  tool: 'search_listings',         description: 'Searching — too broad, returned 47 results',        tokens: 520, durationMs: 1300 },
  { id: 'c6',  tool: 'filter_listings',         description: 'Filtering 47 → 12 listings by criteria',            tokens: 460, durationMs: 1000 },
  { id: 'c7',  tool: 'ask_clarifying_question', description: 'Confused about school district — backtracking',     tokens: 290, durationMs:  800, isWasted: true },
  { id: 'c8',  tool: 'rank_listings',           description: 'Ranking by weighted school + price score',          tokens: 540, durationMs: 1100 },
  { id: 'c9',  tool: 'send_message',            description: 'Composing personalised outreach to buyer',          tokens: 380, durationMs:  900 },
  { id: 'c10', tool: 'check_calendar',          description: 'Fetching agent availability separately',            tokens: 220, durationMs:  700 },
  { id: 'c11', tool: 'schedule_tour',           description: 'Booking property tour slot',                        tokens: 310, durationMs:  800 },
  { id: 'c12', tool: 'update_crm',              description: 'Logging lead info to CRM',                          tokens: 290, durationMs:  700 },
];

export const WARM_STEPS: ToolStep[] = [
  { id: 'w1', tool: 'extract_requirements', description: 'Markov: optimal start for first_time_buyer bucket',      tokens: 280, durationMs: 480 },
  { id: 'w2', tool: 'qualify_lead',         description: 'High-confidence path (94.9% historical success rate)',   tokens: 240, durationMs: 380 },
  { id: 'w3', tool: 'search_listings',      description: 'Targeted: Pittsburgh, $300-600k, school rank ≥ 7',       tokens: 320, durationMs: 520 },
  { id: 'w4', tool: 'rank_listings',        description: 'Skip filter — Markov: 93.8% skip rate in this bucket',   tokens: 360, durationMs: 420 },
  { id: 'w5', tool: 'send_message',         description: 'Template loaded from first_time_buyer memory bucket',    tokens: 190, durationMs: 360 },
  { id: 'w6', tool: 'schedule_tour',        description: 'Combined check+book shortcut (learned pattern)',          tokens: 200, durationMs: 400 },
  { id: 'w7', tool: 'update_crm',           description: 'Auto-filled from extract_requirements state',            tokens: 160, durationMs: 280 },
];

// Markov state paths — one entry per step reveals
export const COLD_MARKOV_PATH = [
  'START', 'UNDERSTAND_BUYER', 'UNDERSTAND_BUYER', 'QUALIFY_LEAD',
  'SEARCH_OPTIONS', 'FILTER_OPTIONS', 'UNDERSTAND_BUYER',
  'RANK_OPTIONS', 'CONTACT_BUYER', 'SCHEDULE_TOUR', 'SCHEDULE_TOUR',
  'UPDATE_CRM', 'DONE',
];

export const WARM_MARKOV_PATH = [
  'START', 'UNDERSTAND_BUYER', 'QUALIFY_LEAD', 'SEARCH_OPTIONS',
  'RANK_OPTIONS', 'CONTACT_BUYER', 'SCHEDULE_TOUR', 'DONE',
];

// 40 synthetic historical traces
type TracePath = string[];

function makeSyntheticTraces(): TracePath[] {
  const optimal: TracePath    = ['UNDERSTAND_BUYER','QUALIFY_LEAD','SEARCH_OPTIONS','RANK_OPTIONS','CONTACT_BUYER','SCHEDULE_TOUR','UPDATE_CRM','DONE'];
  const withFilter: TracePath = ['UNDERSTAND_BUYER','QUALIFY_LEAD','SEARCH_OPTIONS','FILTER_OPTIONS','RANK_OPTIONS','CONTACT_BUYER','SCHEDULE_TOUR','UPDATE_CRM','DONE'];
  const withRecover: TracePath= ['UNDERSTAND_BUYER','QUALIFY_LEAD','SEARCH_OPTIONS','RECOVER','SEARCH_OPTIONS','RANK_OPTIONS','CONTACT_BUYER','SCHEDULE_TOUR','UPDATE_CRM','DONE'];
  const quick: TracePath      = ['UNDERSTAND_BUYER','QUALIFY_LEAD','SEARCH_OPTIONS','RANK_OPTIONS','CONTACT_BUYER','UPDATE_CRM','DONE'];

  const traces: TracePath[] = [];
  for (let i = 0; i < 28; i++) traces.push([...optimal]);
  for (let i = 0; i < 8;  i++) traces.push([...withFilter]);
  for (let i = 0; i < 3;  i++) traces.push([...withRecover]);
  traces.push([...quick]);
  return traces;
}

export const SYNTHETIC_TRACES = makeSyntheticTraces();

// Build the initial Markov state from just the cold run (sparse)
export function buildColdMarkov(): MarkovState {
  let m = initMarkovState([]);
  for (let i = 0; i < COLD_MARKOV_PATH.length - 1; i++) {
    m = recordTransition(m, COLD_MARKOV_PATH[i], COLD_MARKOV_PATH[i + 1]);
  }
  return m;
}

// Build incrementally for learning phase — returns state after N traces
export function buildMarkovAfterTraces(n: number): MarkovState {
  let m = buildColdMarkov();
  for (let i = 0; i < n; i++) {
    const trace = SYNTHETIC_TRACES[i];
    for (let j = 0; j < trace.length - 1; j++) {
      m = recordTransition(m, trace[j], trace[j + 1]);
    }
  }
  return m;
}

export const EMPTY_MARKOV = initMarkovState([]);

// Embedding cloud data
export interface EmbeddingPoint {
  id: string;
  x: number;
  y: number;
  cluster: string;
  color: string;
  isPrompt?: boolean;
}

export const CLUSTER_DEFS: Record<string, { x: number; y: number; color: string; label: string }> = {
  first_time_buyer: { x: -35, y: 22,  color: '#f5a623', label: 'first_time_buyer' },
  investor:         { x:  42, y: -18, color: '#14a8ae', label: 'investor' },
  relocation:       { x:  10, y:  50, color: '#f0ede6', label: 'relocation' },
  upgrade:          { x: -30, y: -42, color: '#a78bfa', label: 'upgrade' },
};

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateTraceEmbeddings(): EmbeddingPoint[] {
  const rand = seededRand(42);
  const counts: Record<string, number> = { first_time_buyer: 28, investor: 5, relocation: 4, upgrade: 3 };
  const points: EmbeddingPoint[] = [];
  let id = 0;

  for (const [cluster, def] of Object.entries(CLUSTER_DEFS)) {
    const count = counts[cluster];
    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const r = 5 + rand() * 18;
      points.push({
        id: `ep-${id++}`,
        x: def.x + Math.cos(angle) * r,
        y: def.y + Math.sin(angle) * r,
        cluster,
        color: def.color,
      });
    }
  }
  return points;
}

export const TRACE_EMBEDDINGS = generateTraceEmbeddings();

export const PROMPT_EMBEDDING: EmbeddingPoint = {
  id: 'prompt-embed',
  x: -31,
  y: 18,
  cluster: 'first_time_buyer',
  color: '#f5a623',
  isPrompt: true,
};

export const MARKOV_SHORT_LABELS: Record<string, string> = {
  START:           'START',
  UNDERSTAND_BUYER:'UNDERSTAND',
  QUALIFY_LEAD:    'QUALIFY',
  SEARCH_OPTIONS:  'SEARCH',
  FILTER_OPTIONS:  'FILTER',
  RANK_OPTIONS:    'RANK',
  CONTACT_BUYER:   'CONTACT',
  SCHEDULE_TOUR:   'SCHEDULE',
  UPDATE_CRM:      'UPDATE',
  DONE:            'DONE',
  RECOVER:         'RECOVER',
};
