import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fadeUp } from '../../lib/motion';
import { useInViewport } from '../../hooks/useInViewport';

export interface StorySlide {
  id: string;
  label?: string;
  content: ReactNode;
}

interface StoryCarouselProps {
  slides: StorySlide[];
  autoAdvanceMs?: number;
  showNumbers?: boolean;
  className?: string;
}

export function StoryCarousel({
  slides,
  autoAdvanceMs = 5500,
  showNumbers = true,
  className = '',
}: StoryCarouselProps) {
  const { ref, isActive } = useInViewport<HTMLDivElement>({ threshold: 0.35 });
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (!isActive || slides.length <= 1) return;
    const timer = setInterval(() => go(index + 1), autoAdvanceMs);
    return () => clearInterval(timer);
  }, [isActive, index, go, autoAdvanceMs, slides.length]);

  return (
    <div ref={ref} className={`w-full ${className}`}>
      <div className="relative min-h-[320px] md:min-h-[380px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[index].id}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            {slides[index].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {showNumbers && (
        <div className="flex items-center justify-center gap-6 mt-10">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => go(i)}
              aria-label={slide.label ?? `Slide ${i + 1}`}
              className="group flex flex-col items-center gap-2"
            >
              <span
                className={`font-display text-2xl transition-all duration-500 ${
                  i === index ? 'text-amber scale-110' : 'text-muted/50 hover:text-muted'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`h-0.5 rounded-full transition-all duration-500 ${
                  i === index ? 'w-10 bg-amber' : 'w-4 bg-border group-hover:w-6'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
