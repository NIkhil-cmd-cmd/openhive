export interface MemoryVector {
  id: string;
  embedding: number[];
  bucket: string;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export function knn(
  query: number[],
  memories: MemoryVector[],
  k: number
): MemoryVector[] {
  return [...memories]
    .map((m) => ({ memory: m, sim: cosineSimilarity(query, m.embedding) }))
    .sort((a, b) => b.sim - a.sim)
    .slice(0, k)
    .map((x) => x.memory);
}

export function majorityVote(buckets: string[]): { bucket: string; confidence: number } {
  if (buckets.length === 0) return { bucket: 'other', confidence: 0 };
  const counts: Record<string, number> = {};
  for (const b of buckets) {
    counts[b] = (counts[b] ?? 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [bucket, count] = sorted[0];
  return { bucket, confidence: count / buckets.length };
}

/** Generate random unit-ish vector for demo */
export function randomEmbedding(dim = 32): number[] {
  const v = Array.from({ length: dim }, () => Math.random() * 2 - 1);
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return v.map((x) => x / norm);
}
