import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

export function CountUp({
  from = 0,
  to,
  duration = 1.2,
  format = (n) => Math.round(n).toString(),
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(format(from));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(format(v)),
    });
    return () => controls.stop();
  }, [inView, from, to, duration, format]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
