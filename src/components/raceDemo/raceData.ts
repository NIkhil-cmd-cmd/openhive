import { recordTransition, initMarkovState, type MarkovState } from '../../lib/markov';

export const FLIGHT_PROMPT =
  'Book me a round-trip flight from San Francisco (SFO) to Pittsburgh. Leaving next Friday morning, coming back Sunday evening. Economy is fine — window seat if possible.';

export interface ToolStep {
  id: string;
  tool: string;
  description: string;
  tokens: number;
  durationMs: number;
  isWasted?: boolean;
}

export const COLD_STEPS: ToolStep[] = [
  { id: 'c1', tool: 'ask_clarifying_question', description: 'No memory — asking for departure city again', tokens: 310, durationMs: 1100, isWasted: true },
  { id: 'c2', tool: 'ask_clarifying_question', description: 'Re-confirming dates and return leg', tokens: 290, durationMs: 1000, isWasted: true },
  { id: 'c3', tool: 'parse_trip_intent', description: 'Parsing SFO → PIT, Fri out / Sun back', tokens: 380, durationMs: 900 },
  { id: 'c4', tool: 'search_flights', description: 'Broad search — 84 itineraries returned', tokens: 540, durationMs: 1400 },
  { id: 'c5', tool: 'filter_flights', description: 'Filtering by economy + morning departure', tokens: 420, durationMs: 1000 },
  { id: 'c6', tool: 'check_price', description: 'Price check on wrong date (Saturday)', tokens: 350, durationMs: 850, isWasted: true },
  { id: 'c7', tool: 'search_flights', description: 'Re-search after date correction', tokens: 480, durationMs: 1200 },
  { id: 'c8', tool: 'compare_airlines', description: 'Comparing United vs Delta vs Southwest', tokens: 410, durationMs: 950 },
  { id: 'c9', tool: 'select_flight', description: 'Selecting outbound SFO → PIT', tokens: 360, durationMs: 800 },
  { id: 'c10', tool: 'select_seat', description: 'Picking window seat outbound', tokens: 280, durationMs: 700 },
  { id: 'c11', tool: 'select_flight', description: 'Selecting return PIT → SFO separately', tokens: 340, durationMs: 780 },
  { id: 'c12', tool: 'process_payment', description: 'Payment + confirmation', tokens: 390, durationMs: 900 },
];

export const WARM_STEPS: ToolStep[] = [
  { id: 'w1', tool: 'parse_trip_intent', description: 'Markov: flight_booking bucket — SFO/PIT parsed', tokens: 260, durationMs: 420 },
  { id: 'w2', tool: 'search_flights', description: 'Targeted search from 40 prior SFO↔PIT traces', tokens: 310, durationMs: 480 },
  { id: 'w3', tool: 'select_flight', description: 'Best outbound+return bundle (learned pattern)', tokens: 290, durationMs: 440 },
  { id: 'w4', tool: 'select_seat', description: 'Window seat rule from memory', tokens: 220, durationMs: 360 },
  { id: 'w5', tool: 'process_payment', description: 'Saved traveler profile — skip re-entry', tokens: 240, durationMs: 400 },
];

export const COLD_MARKOV_PATH = [
  'START', 'PARSE_TRIP', 'PARSE_TRIP', 'SEARCH_FLIGHTS',
  'FILTER_FLIGHTS', 'CHECK_PRICE', 'SEARCH_FLIGHTS',
  'COMPARE_AIRLINES', 'SELECT_FLIGHT', 'SELECT_SEAT',
  'SELECT_FLIGHT', 'PAYMENT', 'DONE',
];

export const WARM_MARKOV_PATH = [
  'START', 'PARSE_TRIP', 'SEARCH_FLIGHTS', 'SELECT_FLIGHT',
  'SELECT_SEAT', 'PAYMENT', 'DONE',
];

type TracePath = string[];

function makeSyntheticTraces(): TracePath[] {
  const optimal: TracePath = ['PARSE_TRIP', 'SEARCH_FLIGHTS', 'SELECT_FLIGHT', 'SELECT_SEAT', 'PAYMENT', 'DONE'];
  const withFilter: TracePath = ['PARSE_TRIP', 'SEARCH_FLIGHTS', 'FILTER_FLIGHTS', 'SELECT_FLIGHT', 'SELECT_SEAT', 'PAYMENT', 'DONE'];
  const withRecover: TracePath = ['PARSE_TRIP', 'SEARCH_FLIGHTS', 'CHECK_PRICE', 'SEARCH_FLIGHTS', 'SELECT_FLIGHT', 'SELECT_SEAT', 'PAYMENT', 'DONE'];
  const quick: TracePath = ['PARSE_TRIP', 'SEARCH_FLIGHTS', 'SELECT_FLIGHT', 'PAYMENT', 'DONE'];

  const traces: TracePath[] = [];
  for (let i = 0; i < 28; i++) traces.push([...optimal]);
  for (let i = 0; i < 8; i++) traces.push([...withFilter]);
  for (let i = 0; i < 3; i++) traces.push([...withRecover]);
  traces.push([...quick]);
  return traces;
}

export const SYNTHETIC_TRACES = makeSyntheticTraces();

export function buildColdMarkov(): MarkovState {
  let m = initMarkovState([]);
  for (let i = 0; i < COLD_MARKOV_PATH.length - 1; i++) {
    m = recordTransition(m, COLD_MARKOV_PATH[i], COLD_MARKOV_PATH[i + 1]);
  }
  return m;
}

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

export interface EmbeddingPoint {
  id: string;
  x: number;
  y: number;
  cluster: string;
  color: string;
  isPrompt?: boolean;
}

export const CLUSTER_DEFS: Record<string, { x: number; y: number; color: string; label: string }> = {
  flight_booking: { x: -32, y: 20, color: '#f5a623', label: 'flight_booking' },
  business_travel: { x: 40, y: -16, color: '#14a8ae', label: 'business_travel' },
  round_trip: { x: 8, y: 48, color: '#f0ede6', label: 'round_trip' },
  seat_upgrade: { x: -28, y: -40, color: '#a78bfa', label: 'seat_upgrade' },
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
  const counts: Record<string, number> = { flight_booking: 28, business_travel: 5, round_trip: 4, seat_upgrade: 3 };
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
  x: -29,
  y: 17,
  cluster: 'flight_booking',
  color: '#f5a623',
  isPrompt: true,
};

export const MARKOV_SHORT_LABELS: Record<string, string> = {
  START: 'START',
  PARSE_TRIP: 'PARSE',
  SEARCH_FLIGHTS: 'SEARCH',
  FILTER_FLIGHTS: 'FILTER',
  CHECK_PRICE: 'PRICE',
  COMPARE_AIRLINES: 'COMPARE',
  SELECT_FLIGHT: 'SELECT',
  SELECT_SEAT: 'SEAT',
  PAYMENT: 'PAY',
  DONE: 'DONE',
};
