import { useEffect, type ReactNode } from 'react';
import { HexGrid } from './HexGrid';
import { useInViewport } from '../../hooks/useInViewport';

interface ScrollSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  hexOpacity?: number;
  dark?: boolean;
  onActiveChange?: (active: boolean) => void;
  innerClassName?: string;
}

export function ScrollSection({
  id,
  children,
  className = '',
  hexOpacity = 0.03,
  dark = true,
  onActiveChange,
  innerClassName = '',
}: ScrollSectionProps) {
  const { ref, isActive } = useInViewport<HTMLElement>({ threshold: 0.4 });

  useEffect(() => {
    onActiveChange?.(isActive);
  }, [isActive, onActiveChange]);

  return (
    <section
      id={id}
      ref={ref}
      data-active={isActive}
      className={`scroll-section relative min-h-[100dvh] flex flex-col justify-center snap-start snap-always overflow-hidden ${
        dark ? 'bg-bg' : 'bg-bg-2'
      } ${className}`}
    >
      <HexGrid opacity={hexOpacity} animated={isActive} pulse={isActive} />
      <div
        className={`relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-28 md:py-32 ${innerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
