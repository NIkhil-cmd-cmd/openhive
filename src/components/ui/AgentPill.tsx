import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AgentPillProps {
  agentId: string;
  bucket: string;
  memoryCount: number;
  confidence: number;
}

export function AgentPill({ agentId, bucket, memoryCount, confidence }: AgentPillProps) {
  const [memories, setMemories] = useState(memoryCount);
  const [conf, setConf] = useState(confidence);

  useEffect(() => {
    const interval = setInterval(() => {
      setMemories((m) => m + Math.floor(Math.random() * 3));
      setConf((c) => Math.min(95, c + Math.floor(Math.random() * 4) - 1));
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const barWidth = `${conf}%`;

  return (
    <div
      className="flex items-center gap-3 bg-bg-2 border border-border px-4 py-2 font-mono text-xs"
      style={{ clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)' }}
    >
      <span
        className="h-2 w-2 rounded-full bg-amber shrink-0"
        style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
      />
      <span className="text-white font-medium">{agentId}</span>
      <span className="text-muted">[{bucket}]</span>
      <span className="text-muted">{memories} memories</span>
      <motion.div className="flex-1 h-1.5 bg-bg-3 rounded-sm overflow-hidden min-w-[60px] max-w-[100px]">
        <motion.div
          className="h-full bg-amber"
          animate={{ width: barWidth }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
      <span className="text-amber">{conf}%</span>
    </div>
  );
}
