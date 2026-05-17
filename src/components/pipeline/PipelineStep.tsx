import { motion } from 'framer-motion';
import { HexBadge } from '../ui/HexBadge';
import type { ReactNode } from 'react';

interface PipelineStepProps {
  number: string;
  title: string;
  summary: string;
  expanded: boolean;
  onSelect: () => void;
  children?: ReactNode;
}

export function PipelineStep({
  number,
  title,
  summary,
  expanded,
  onSelect,
  children,
}: PipelineStepProps) {
  return (
    <div className="border border-border rounded-xl bg-bg-2 overflow-hidden">
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left p-6 flex items-start gap-4 hover:bg-bg-3/50 transition-colors"
      >
        <HexBadge variant="fill" size="md">
          {number}
        </HexBadge>
        <div className="flex-1">
          <h3 className="font-display text-2xl md:text-4xl text-white">{title}</h3>
          {!expanded && <p className="font-mono text-sm text-muted mt-2">{summary}</p>}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 border-t border-border">{children}</div>
      </motion.div>
    </div>
  );
}
