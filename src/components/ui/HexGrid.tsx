import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { generateHexGrid, hexPath } from '../../lib/hexMath';

interface HexGridProps {
  opacity?: number;
  animated?: boolean;
  pulse?: boolean;
  className?: string;
  hexSize?: number;
}

export function HexGrid({
  opacity = 0.03,
  animated = true,
  pulse = true,
  className = '',
  hexSize = 28,
}: HexGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cells, setCells] = useState<{ x: number; y: number }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setSize({ w: width, h: height });
      setCells(generateHexGrid(width + 100, height + 100, hexSize, -50, -50));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [hexSize]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700 ${className}`}
      style={
        {
          '--hex-opacity': opacity,
          opacity: animated ? 1 : 0.5,
          animation: pulse && animated ? 'hex-breathe 5s ease-in-out infinite' : 'none',
        } as CSSProperties
      }
      aria-hidden
    >
      <svg width={size.w + 100} height={size.h + 100} className="absolute inset-0" style={{ opacity }}>
        {cells.map((c, i) => (
          <path
            key={i}
            d={hexPath(c.x, c.y, hexSize)}
            fill="none"
            stroke="var(--amber)"
            strokeWidth={0.5}
            strokeOpacity={0.35}
          />
        ))}
      </svg>
    </div>
  );
}
