import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AnimatePresence, motion } from 'framer-motion';
import { nodeTypes } from './flow/FlowNodes';
import { buildEdges, buildNodes } from './flow/buildGraph';
import type { FlowPhase, PathMode } from './flow/types';
import { NODE_INFO, PHASE_ORDER } from './flow/types';

function HiveMindFlow() {
  const [phase, setPhase] = useState<FlowPhase>('idle');
  const [pathMode, setPathMode] = useState<PathMode>('all');
  const [playing, setPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const initialNodes = useMemo(() => buildNodes('idle', 'all'), []);
  const initialEdges = useMemo(() => buildEdges('idle', 'all'), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const syncGraph = useCallback(
    (p: FlowPhase, m: PathMode) => {
      setNodes(buildNodes(p, m));
      setEdges(buildEdges(p, m));
    },
    [setNodes, setEdges]
  );

  const runTour = useCallback(() => {
    setPlaying(true);
    let i = 0;
    const step = () => {
      if (i < PHASE_ORDER.length) {
        const p = PHASE_ORDER[i];
        setPhase(p);
        syncGraph(p, 'all');
        i++;
        setTimeout(step, 1000);
      } else {
        setPhase('idle');
        syncGraph('idle', pathMode);
        setPlaying(false);
      }
    };
    step();
  }, [syncGraph, pathMode]);

  const onPathMode = (m: PathMode) => {
    setPathMode(m);
    syncGraph(phase, m);
  };

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setSelectedId(node.id);
      const ids = [...PHASE_ORDER, 'embed', 'hive', 'knn', 'markov', 'execute', 'writeback'];
      if (ids.includes(node.id)) {
        const p = node.id as FlowPhase;
        setPhase(p);
        syncGraph(p, pathMode);
      }
    },
    [pathMode, syncGraph]
  );

  const info = selectedId ? NODE_INFO[selectedId] : null;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {(['all', 'read', 'write'] as PathMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onPathMode(m)}
            className={`font-mono text-min px-5 py-3 rounded-lg border transition-colors ${
              pathMode === m
                ? 'border-amber text-amber bg-[var(--amber-glow)]'
                : 'border-border text-muted hover:text-white'
            }`}
          >
            {m === 'all' ? 'Full loop' : m === 'read' ? 'Read path' : 'Write path'}
          </button>
        ))}
        <button
          type="button"
          onClick={runTour}
          disabled={playing}
          className="font-mono text-min px-6 py-3 rounded-lg bg-amber text-bg disabled:opacity-50 font-semibold"
        >
          {playing ? 'Playing…' : '▶ Play flow'}
        </button>
      </div>

      <div className="flex justify-between px-4 mb-2 max-w-4xl mx-auto">
        <span className="font-mono text-label text-muted tracking-widest">AGENTS</span>
        <span className="font-mono text-label text-muted tracking-widest">HIVE CORE</span>
        <span className="font-mono text-label text-muted tracking-widest">ROUTING</span>
      </div>

      <div className="h-[min(65vh,700px)] min-h-[560px] w-full rounded-xl border border-border overflow-hidden bg-[#0a0a0f] hive-flow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.35}
          maxZoom={1.2}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(245,166,35,0.08)" />
          <Controls
            showInteractive={false}
            className="!bg-bg-2 !border-border !shadow-none [&>button]:!bg-bg-3 [&>button]:!border-border [&>button]:!text-white"
          />
          <MiniMap
            nodeColor={() => '#1a1a28'}
            maskColor="rgba(8,8,15,0.85)"
            className="!bg-bg-2 !border-border"
          />
        </ReactFlow>
      </div>

      <AnimatePresence mode="wait">
        {info && (
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 panel p-6 border-l-4 border-l-amber"
          >
            <p className="font-display text-4xl text-amber mb-2">{info.title}</p>
            <p className="font-mono text-body text-muted">{info.body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HiveMindDiagram() {
  return (
    <ReactFlowProvider>
      <HiveMindFlow />
    </ReactFlowProvider>
  );
}
