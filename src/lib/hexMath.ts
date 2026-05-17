export const HEX_RADIUS = 28;

export interface Point {
  x: number;
  y: number;
}

/** Flat-top hexagon vertices */
export function hexVertices(cx: number, cy: number, r: number): Point[] {
  const verts: Point[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    verts.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  }
  return verts;
}

export function hexPath(cx: number, cy: number, r: number): string {
  const v = hexVertices(cx, cy, r);
  return v.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';
}

/** Axial to pixel (flat-top) */
export function axialToPixel(q: number, r: number, size: number): Point {
  const x = size * (3 / 2) * q;
  const y = size * (Math.sqrt(3) / 2 * q + Math.sqrt(3) * r);
  return { x, y };
}

/** Generate hex grid cells covering bounds */
export function generateHexGrid(
  width: number,
  height: number,
  size: number,
  offsetX = 0,
  offsetY = 0
): Point[] {
  const cells: Point[] = [];
  const cols = Math.ceil(width / (size * 1.5)) + 2;
  const rows = Math.ceil(height / (size * Math.sqrt(3))) + 2;

  for (let col = -1; col < cols; col++) {
    for (let row = -1; row < rows; row++) {
      const q = col - Math.floor(row / 2);
      const r = row;
      const p = axialToPixel(q, r, size);
      cells.push({ x: p.x + offsetX, y: p.y + offsetY });
    }
  }
  return cells;
}

/** Honeycomb ring coordinates (axial) */
export function hexRingCoords(radius: number): { q: number; r: number }[] {
  if (radius === 0) return [{ q: 0, r: 0 }];
  const coords: { q: number; r: number }[] = [];
  let q = 0;
  let r = -radius;
  const dirs = [
    { q: 1, r: 0 },
    { q: 0, r: 1 },
    { q: -1, r: 1 },
    { q: -1, r: 0 },
    { q: 0, r: -1 },
    { q: 1, r: -1 },
  ];
  for (const d of dirs) {
    for (let i = 0; i < radius; i++) {
      coords.push({ q, r });
      q += d.q;
      r += d.r;
    }
  }
  return coords;
}

export function allHexCoords(maxRadius: number): { q: number; r: number; ring: number }[] {
  const result: { q: number; r: number; ring: number }[] = [];
  for (let ring = 0; ring <= maxRadius; ring++) {
    for (const { q, r } of hexRingCoords(ring)) {
      result.push({ q, r, ring });
    }
  }
  return result;
}
