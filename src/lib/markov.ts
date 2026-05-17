export interface Transition {
  from: string;
  to: string;
  count: number;
}

export interface MarkovState {
  transitions: Transition[];
  visitCounts: Record<string, number>;
}

export function initMarkovState(paths: string[][]): MarkovState {
  const transitions: Transition[] = [];
  const visitCounts: Record<string, number> = {};

  const addTransition = (from: string, to: string) => {
    const existing = transitions.find((t) => t.from === from && t.to === to);
    if (existing) existing.count++;
    else transitions.push({ from, to, count: 1 });
    visitCounts[from] = (visitCounts[from] ?? 0) + 1;
    visitCounts[to] = (visitCounts[to] ?? 0) + 1;
  };

  for (const path of paths) {
    for (let i = 0; i < path.length - 1; i++) {
      addTransition(path[i], path[i + 1]);
    }
  }

  return { transitions, visitCounts };
}

export function getTransitionProbability(
  state: MarkovState,
  from: string,
  to: string
): number {
  const fromTransitions = state.transitions.filter((t) => t.from === from);
  const total = fromTransitions.reduce((s, t) => s + t.count, 0);
  if (total === 0) return 0;
  const match = fromTransitions.find((t) => t.to === to);
  return match ? match.count / total : 0;
}

export function recordTransition(
  state: MarkovState,
  from: string,
  to: string
): MarkovState {
  const transitions = [...state.transitions];
  const existing = transitions.find((t) => t.from === from && t.to === to);
  if (existing) {
    existing.count++;
  } else {
    transitions.push({ from, to, count: 1 });
  }
  const visitCounts = { ...state.visitCounts };
  visitCounts[from] = (visitCounts[from] ?? 0) + 1;
  visitCounts[to] = (visitCounts[to] ?? 0) + 1;
  return { transitions, visitCounts };
}

export function getNodesForBucket(_bucket: string, paths: string[][]): string[] {
  const nodes = new Set<string>();
  for (const path of paths) {
    path.forEach((n) => nodes.add(n));
  }
  return Array.from(nodes);
}
