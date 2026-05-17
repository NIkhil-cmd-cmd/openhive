import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { allHexCoords, axialToPixel, hexPath } from '../../lib/hexMath';
import { useInViewport } from '../../hooks/useInViewport';

const SIZE = 40;
const coords = allHexCoords(2);

export function HiveDiagram() {
  const { ref, isActive } = useInViewport<HTMLDivElement>({ threshold: 0.2 });
  const [pulseRing, setPulseRing] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setPulseRing((r) => (r + 1) % 3);
    }, 2800);
    return () => clearInterval(interval);
  }, [isActive]);

  const cx = 220;
  const cy = 220;
  let agentNum = 0;

  return (
    <div ref={ref} className="w-full max-w-lg mx-auto">
      <svg viewBox="0 0 440 440" className="w-full">
        {coords.map(({ q, r, ring }) => {
          const p = axialToPixel(q, r, SIZE);
          const x = cx + p.x;
          const y = cy + p.y;
          const isCenter = ring === 0;
          const isRing1 = ring === 1;
          const lit = ring <= pulseRing;
          const fill = isCenter
            ? 'rgba(245,166,35,0.35)'
            : isRing1
              ? lit
                ? 'rgba(245,166,35,0.28)'
                : 'rgba(245,166,35,0.12)'
              : lit
                ? 'rgba(245,166,35,0.14)'
                : 'rgba(245,166,35,0.04)';

          let label = '+';
          if (isCenter) label = 'HIVE';
          else if (isRing1) {
            agentNum += 1;
            label = `A${agentNum}`;
          }

          return (
            <g key={`${q}-${r}`}>
              <motion.path
                d={hexPath(x, y, SIZE - 2)}
                fill={fill}
                stroke="var(--amber)"
                strokeWidth={isCenter ? 1.5 : 1}
                strokeOpacity={isCenter ? 0.8 : 0.35}
                animate={
                  isCenter && isActive
                    ? { opacity: [0.7, 1, 0.7] }
                    : { opacity: lit ? 1 : 0.6 }
                }
                transition={{
                  duration: isCenter ? 3.5 : 0.8,
                  repeat: isCenter ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              />
              {isRing1 && lit && (
                <line
                  x1={x}
                  y1={y}
                  x2={cx}
                  y2={cy}
                  stroke="var(--amber)"
                  strokeOpacity={0.35}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              )}
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="var(--white)"
                fontSize={isCenter ? 11 : 9}
                fontFamily="DM Mono, monospace"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
