import type { ReactNode } from 'react';
import { HexGrid } from './HexGrid';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'elevated';
  showGrid?: boolean;
}

export function Section({
  id,
  children,
  className = '',
  tone = 'default',
  showGrid = true,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative isolate py-20 md:py-28 ${tone === 'elevated' ? 'bg-bg-2' : 'bg-bg'} ${className}`}
    >
      {showGrid && (
        <HexGrid opacity={0.025} animated={false} pulse={false} className="z-0" />
      )}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">{children}</div>
    </section>
  );
}
