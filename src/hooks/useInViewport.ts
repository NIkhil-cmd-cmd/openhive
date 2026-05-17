import { useEffect, useRef, useState } from 'react';

interface UseInViewportOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInViewport<T extends HTMLElement = HTMLElement>(
  options: UseInViewportOptions = {}
) {
  const { threshold = 0.45, rootMargin = '0px' } = options;
  const ref = useRef<T>(null);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= threshold * 0.5);
        setProgress(entry.intersectionRatio);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isActive, progress };
}
