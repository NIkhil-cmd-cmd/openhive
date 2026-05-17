import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import type { ReactNode } from 'react';

interface TerminalWindowProps {
  title: string;
  children: ReactNode;
  typewriter?: boolean;
  className?: string;
}

export function TerminalWindow({
  title,
  children,
  typewriter = false,
  className = '',
}: TerminalWindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const textContent = typeof children === 'string' ? children : '';

  useEffect(() => {
    if (!typewriter || !inView || started) return;
    setStarted(true);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(textContent.slice(0, i));
      if (i >= textContent.length) clearInterval(timer);
    }, 12);
    return () => clearInterval(timer);
  }, [typewriter, inView, textContent, started]);

  return (
    <div
      ref={ref}
      className={`rounded-lg overflow-hidden border border-border bg-bg ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-bg-3 border-b border-border">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 font-mono text-xs text-muted">{title}</span>
      </div>
      <pre className="p-4 font-mono text-xs leading-relaxed text-white overflow-x-auto m-0 whitespace-pre-wrap">
        {typewriter ? (
          <>
            {displayed}
            {inView && displayed.length < textContent.length && (
              <span className="inline-block w-2 h-4 bg-amber ml-0.5 animate-pulse align-middle" />
            )}
          </>
        ) : (
          children
        )}
      </pre>
    </div>
  );
}
