import { AgentPill } from '../ui/AgentPill';

const AGENTS = [
  { agentId: 'AGENT-A', bucket: 'smart_home', memoryCount: 42, confidence: 82 },
  { agentId: 'AGENT-B', bucket: 'information', memoryCount: 28, confidence: 61 },
  { agentId: 'AGENT-C', bucket: 'scheduling', memoryCount: 15, confidence: 44 },
];

export function AgentStatusBar() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-4">
      <p className="font-mono text-[10px] text-muted tracking-widest mb-3 text-center md:text-left">
        LIVE AGENT STATUS
      </p>
      <div className="flex flex-col md:flex-row gap-3 justify-center">
        {AGENTS.map((a) => (
          <AgentPill key={a.agentId} {...a} />
        ))}
      </div>
    </div>
  );
}
