import { useEffect, useRef } from 'react';
import { generateHexGrid, hexVertices, axialToPixel } from '../../lib/hexMath';

interface HiveCanvasProps {
  variant?: 'hero' | 'cta';
  className?: string;
  isActive?: boolean;
}

interface Bee {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  trail: { x: number; y: number }[];
}

interface Pulse {
  x: number;
  y: number;
  start: number;
}

const HEX_SIZE = 28;
const BEE_COUNT = 5;

export function HiveCanvas({ variant = 'hero', className = '', isActive = true }: HiveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offsetRef = useRef(0);
  const beesRef = useRef<Bee[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const hiveFlashRef = useRef(0);
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(true);
  const lastPulseRef = useRef(0);
  const lastTimeRef = useRef(0);
  const isActiveRef = useRef(isActive);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let gridCanvas = gridCanvasRef.current;
    if (!gridCanvas) {
      gridCanvas = document.createElement('canvas');
      gridCanvasRef.current = gridCanvas;
    }

    const rebuildGrid = (width: number, height: number) => {
      const gctx = gridCanvas!.getContext('2d');
      if (!gctx) return;
      gridCanvas!.width = width + 200;
      gridCanvas!.height = height + 200;
      gctx.clearRect(0, 0, gridCanvas!.width, gridCanvas!.height);
      const strokeOpacity = variant === 'cta' ? 0.12 : 0.06;
      const fillOpacity = variant === 'cta' ? 0.08 : 0;
      const cells = generateHexGrid(width + 200, height + 200, HEX_SIZE, 0, 0);
      gctx.strokeStyle = `rgba(245, 166, 35, ${strokeOpacity})`;
      gctx.lineWidth = 1;
      for (const cell of cells) {
        const verts = hexVertices(cell.x, cell.y, HEX_SIZE);
        gctx.beginPath();
        verts.forEach((v, i) => {
          if (i === 0) gctx.moveTo(v.x, v.y);
          else gctx.lineTo(v.x, v.y);
        });
        gctx.closePath();
        if (fillOpacity > 0) {
          gctx.fillStyle = `rgba(245, 166, 35, ${fillOpacity})`;
          gctx.fill();
        }
        gctx.stroke();
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildGrid(rect.width, rect.height);

      if (beesRef.current.length === 0) {
        beesRef.current = Array.from({ length: BEE_COUNT }, (_, i) => {
          const angle = (i / BEE_COUNT) * Math.PI * 2;
          const dist = 120 + Math.random() * 80;
          return {
            x: rect.width / 2 + Math.cos(angle) * dist,
            y: rect.height / 2 + Math.sin(angle) * dist,
            vx: 0,
            vy: 0,
            phase: angle,
            trail: [],
          };
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.getBoundingClientRect().width;
    const h = () => canvas.getBoundingClientRect().height;

    const onVisibility = () => {
      visibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);

    const draw = (time: number) => {
      rafRef.current = requestAnimationFrame(draw);

      if (!visibleRef.current || !isActiveRef.current) {
        lastTimeRef.current = time;
        return;
      }

      const dt = Math.min((time - lastTimeRef.current) / 16.67, 2.5);
      lastTimeRef.current = time;

      const width = w();
      const height = h();
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      offsetRef.current += 0.12 * dt;
      const ox = -(offsetRef.current % (HEX_SIZE * 1.5));
      if (gridCanvas) {
        ctx.drawImage(gridCanvas, ox, 0, width + 200, height + 200);
      }

      const hivePulse = 0.05 + 0.07 * (0.5 + 0.5 * Math.sin(time / 4000));
      const flashBoost = hiveFlashRef.current > time ? 0.15 : 0;
      const hiveCoords = [
        { q: 0, r: 0 },
        { q: 1, r: 0 },
        { q: 0, r: 1 },
        { q: -1, r: 1 },
        { q: -1, r: 0 },
        { q: 0, r: -1 },
        { q: 1, r: -1 },
      ];

      for (const { q, r } of hiveCoords) {
        const p = axialToPixel(q, r, HEX_SIZE * 0.9);
        const verts = hexVertices(cx + p.x, cy + p.y, HEX_SIZE * 0.85);
        const isCenter = q === 0 && r === 0;
        const alpha = (isCenter ? hivePulse * 1.4 : hivePulse) + flashBoost;
        ctx.fillStyle = `rgba(245, 166, 35, ${alpha})`;
        ctx.beginPath();
        verts.forEach((v, i) => {
          if (i === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        ctx.fill();
      }

      if (time - lastPulseRef.current > 2800 + Math.sin(time / 1000) * 800) {
        lastPulseRef.current = time;
        const bee = beesRef.current[Math.floor(Math.random() * beesRef.current.length)];
        pulsesRef.current.push({ x: bee.x, y: bee.y, start: time });
      }

      pulsesRef.current = pulsesRef.current.filter((p) => {
        const elapsed = time - p.start;
        if (elapsed > 1000) return false;
        const radius = (elapsed / 1000) * 90;
        const alpha = 1 - elapsed / 1000;
        ctx.strokeStyle = `rgba(245, 166, 35, ${alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        const dist = Math.hypot(p.x - cx, p.y - cy);
        if (radius > dist - 50 && radius < dist + 30) {
          hiveFlashRef.current = time + 500;
        }
        return true;
      });

      beesRef.current.forEach((bee) => {
        bee.phase += 0.008 * dt;
        const toHiveX = cx - bee.x;
        const toHiveY = cy - bee.y;
        const dist = Math.hypot(toHiveX, toHiveY) || 1;
        const orbitStrength = dist < 180 ? 0.02 : 0.006;
        const tangentX = -toHiveY / dist;
        const tangentY = toHiveX / dist;

        bee.vx += (toHiveX / dist) * orbitStrength * dt + tangentX * 0.35 * dt;
        bee.vy += (toHiveY / dist) * orbitStrength * dt + tangentY * 0.35 * dt;
        bee.vx += Math.sin(bee.phase) * 0.08 * dt;
        bee.vy += Math.cos(bee.phase * 1.3) * 0.08 * dt;
        bee.vx *= 0.96;
        bee.vy *= 0.96;

        const speed = Math.hypot(bee.vx, bee.vy);
        const maxSpeed = 1.8;
        if (speed > maxSpeed) {
          bee.vx = (bee.vx / speed) * maxSpeed;
          bee.vy = (bee.vy / speed) * maxSpeed;
        }

        bee.x += bee.vx * dt;
        bee.y += bee.vy * dt;

        const margin = 30;
        if (bee.x < margin) bee.vx += 0.3;
        if (bee.x > width - margin) bee.vx -= 0.3;
        if (bee.y < margin) bee.vy += 0.3;
        if (bee.y > height - margin) bee.vy -= 0.3;

        bee.trail.push({ x: bee.x, y: bee.y });
        if (bee.trail.length > 16) bee.trail.shift();

        if (dist < 220) {
          ctx.strokeStyle = `rgba(245, 166, 35, ${0.15 * (1 - dist / 220)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(bee.x, bee.y);
          ctx.lineTo(cx, cy);
          ctx.stroke();
        }

        for (let i = 0; i < bee.trail.length; i++) {
          const t = bee.trail[i];
          const alpha = (i / bee.trail.length) * 0.35;
          ctx.fillStyle = `rgba(245, 166, 35, ${alpha})`;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1.5 + i * 0.05, 0, Math.PI * 2);
          ctx.fill();
        }

        const grad = ctx.createRadialGradient(bee.x, bee.y, 0, bee.x, bee.y, 16);
        grad.addColorStop(0, 'rgba(245, 166, 35, 0.35)');
        grad.addColorStop(1, 'rgba(245, 166, 35, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bee.x, bee.y, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'var(--amber)';
        ctx.beginPath();
        ctx.arc(bee.x, bee.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden
    />
  );
}
