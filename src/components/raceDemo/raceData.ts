import { recordTransition, initMarkovState, type MarkovState } from '../../lib/markov';

export const FLIGHT_BOOKING_PROMPT =
  `Hi there, I'm looking to fly from New York to London sometime next month for two people. We're flexible on exact dates but need to be back before the 25th. Budget is around $800 per person each way. We'd prefer non-stop if possible but open to one stop.`;

export interface ToolStep {
  id: string;
  tool: string;
  description: string;
  tokens: number;
  durationMs: number;
  isWasted?: boolean;
}

export const COLD_STEPS: ToolStep[] = [
  { id: 'c1',  tool: 'ask_clarifying_question',    description: 'No prior context — asking about travel dates',            tokens: 320, durationMs: 1200, isWasted: true },
  { id: 'c2',  tool: 'ask_clarifying_question',    description: 'Still unclear — asking round-trip vs one-way',            tokens: 280, durationMs: 1100, isWasted: true },
  { id: 'c3',  tool: 'extract_travel_requirements', description: 'Extracting traveler needs from conversation',             tokens: 410, durationMs: 1000 },
  { id: 'c4',  tool: 'check_traveler_profile',     description: 'Checking loyalty program & frequent flyer status',        tokens: 380, durationMs:  900 },
  { id: 'c5',  tool: 'search_flights',             description: 'Searching — too broad, returned 80+ results',             tokens: 520, durationMs: 1300 },
  { id: 'c6',  tool: 'filter_flights',             description: 'Filtering 80 → 14 flights by stops and price',            tokens: 460, durationMs: 1000 },
  { id: 'c7',  tool: 'ask_clarifying_question',    description: 'Confused about seat class preference — backtracking',     tokens: 290, durationMs:  800, isWasted: true },
  { id: 'c8',  tool: 'rank_flights',               description: 'Ranking by weighted price + schedule score',              tokens: 540, durationMs: 1100 },
  { id: 'c9',  tool: 'send_itinerary',             description: 'Composing personalised flight options for traveler',      tokens: 380, durationMs:  900 },
  { id: 'c10', tool: 'check_seat_availability',    description: 'Checking seat availability separately',                   tokens: 220, durationMs:  700 },
  { id: 'c11', tool: 'book_flight',                description: 'Reserving selected flight and seats',                     tokens: 310, durationMs:  800 },
  { id: 'c12', tool: 'send_confirmation',          description: 'Sending booking confirmation to traveler',                 tokens: 290, durationMs:  700 },
];

export const WARM_STEPS: ToolStep[] = [
  { id: 'w1', tool: 'extract_travel_requirements', description: 'Markov: optimal start for budget_traveler bucket',        tokens: 280, durationMs: 480 },
  { id: 'w2', tool: 'check_traveler_profile',      description: 'High-confidence path (94.9% historical success rate)',   tokens: 240, durationMs: 380 },
  { id: 'w3', tool: 'search_flights',              description: 'Targeted: JFK→LHR, <$800pp, non-stop preferred',         tokens: 320, durationMs: 520 },
  { id: 'w4', tool: 'rank_flights',                description: 'Skip filter — Markov: 93.8% skip rate in this bucket',   tokens: 360, durationMs: 420 },
  { id: 'w5', tool: 'send_itinerary',              description: 'Template loaded from budget_traveler memory bucket',     tokens: 190, durationMs: 360 },
  { id: 'w6', tool: 'book_flight',                 description: 'Combined availability+book shortcut (learned pattern)',   tokens: 200, durationMs: 400 },
  { id: 'w7', tool: 'send_confirmation',           description: 'Auto-filled from extract_travel_requirements state',     tokens: 160, durationMs: 280 },
];

// Markov state paths — one entry per step reveals
export const COLD_MARKOV_PATH = [
  'START', 'UNDERSTAND_TRAVELER', 'UNDERSTAND_TRAVELER', 'CHECK_PROFILE',
  'SEARCH_OPTIONS', 'FILTER_OPTIONS', 'UNDERSTAND_TRAVELER',
  'RANK_OPTIONS', 'CONTACT_TRAVELER', 'BOOK_FLIGHT', 'BOOK_FLIGHT',
  'CONFIRM_BOOKING', 'DONE',
];

export const WARM_MARKOV_PATH = [
  'START', 'UNDERSTAND_TRAVELER', 'CHECK_PROFILE', 'SEARCH_OPTIONS',
  'RANK_OPTIONS', 'CONTACT_TRAVELER', 'BOOK_FLIGHT', 'DONE',
];

// 40 synthetic historical traces
type TracePath = string[];

function makeSyntheticTraces(): TracePath[] {
  const optimal: TracePath    = ['UNDERSTAND_TRAVELER','CHECK_PROFILE','SEARCH_OPTIONS','RANK_OPTIONS','CONTACT_TRAVELER','BOOK_FLIGHT','CONFIRM_BOOKING','DONE'];
  const withFilter: TracePath = ['UNDERSTAND_TRAVELER','CHECK_PROFILE','SEARCH_OPTIONS','FILTER_OPTIONS','RANK_OPTIONS','CONTACT_TRAVELER','BOOK_FLIGHT','CONFIRM_BOOKING','DONE'];
  const withRecover: TracePath= ['UNDERSTAND_TRAVELER','CHECK_PROFILE','SEARCH_OPTIONS','RECOVER','SEARCH_OPTIONS','RANK_OPTIONS','CONTACT_TRAVELER','BOOK_FLIGHT','CONFIRM_BOOKING','DONE'];
  const quick: TracePath      = ['UNDERSTAND_TRAVELER','CHECK_PROFILE','SEARCH_OPTIONS','RANK_OPTIONS','CONTACT_TRAVELER','CONFIRM_BOOKING','DONE'];

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
  budget_traveler: { x: -35, y: 22,  color: '#f5a623', label: 'budget_traveler' },
  business_class:  { x:  42, y: -18, color: '#14a8ae', label: 'business_class' },
  family_vacation: { x:  10, y:  50, color: '#f0ede6', label: 'family_vacation' },
  frequent_flyer:  { x: -30, y: -42, color: '#a78bfa', label: 'frequent_flyer' },
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
  const counts: Record<string, number> = { budget_traveler: 28, business_class: 5, family_vacation: 4, frequent_flyer: 3 };
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
  cluster: 'budget_traveler',
  color: '#f5a623',
  isPrompt: true,
};

export const MARKOV_SHORT_LABELS: Record<string, string> = {
  START:               'START',
  UNDERSTAND_TRAVELER: 'UNDERSTAND',
  CHECK_PROFILE:       'CHECK',
  SEARCH_OPTIONS:      'SEARCH',
  FILTER_OPTIONS:      'FILTER',
  RANK_OPTIONS:        'RANK',
  CONTACT_TRAVELER:    'CONTACT',
  BOOK_FLIGHT:         'BOOK',
  CONFIRM_BOOKING:     'CONFIRM',
  DONE:                'DONE',
  RECOVER:             'RECOVER',
};
