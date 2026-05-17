import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import type { MarkovState } from '../../lib/markov';
import { MARKOV_SHORT_LABELS } from './raceData';

interface RaceMarkovGraphProps {
  state: MarkovState;
  flashEdge?: { from: string; to: string };
  highlightPath?: string[];
  active?: boolean;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  count: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  count: number;
  from: string;
  to: string;
}

export function RaceMarkovGraph({
  state,
  flashEdge,
  highlightPath = [],
  active = true,
}: RaceMarkovGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const graphData = useMemo(() => {
    const nodes = new Set<string>();
    state.transitions.forEach((t) => {
      nodes.add(t.from);
      nodes.add(t.to);
    });
    const nodeList: SimNode[] = Array.from(nodes).map((id) => ({
      id,
      count: state.visitCounts[id] ?? 1,
    }));
    const links: SimLink[] = state.transitions.map((t) => ({
      source: t.from,
      target: t.to,
      count: t.count,
      from: t.from,
      to: t.to,
    }));
    return { nodes: nodeList, links };
  }, [state]);

  useEffect(() => {
    if (!svgRef.current || !active || graphData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const w = svgRef.current.clientWidth || 320;
    const h = 240;
    svg.attr('viewBox', `0 0 ${w} ${h}`);
    svg.selectAll('*').remove();

    // Arrow marker
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'var(--amber)')
      .attr('fill-opacity', 0.4);

    const nodes = graphData.nodes.map((n) => ({ ...n }));
    const links = graphData.links.map((l) => ({ ...l }));

    const maxCount = Math.max(...state.transitions.map((t) => t.count), 1);

    const sim = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink<SimNode, SimLink>(links).id((d) => d.id).distance(55)
      )
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide(18));

    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('marker-end', 'url(#arrow)')
      .attr('stroke', (d) => {
        const isFlash =
          flashEdge && d.from === flashEdge.from && d.to === flashEdge.to;
        const isHighlight =
          highlightPath.length > 1 &&
          highlightPath.some(
            (s, i) => i < highlightPath.length - 1 && s === d.from && highlightPath[i + 1] === d.to
          );
        return isFlash ? '#fff' : isHighlight ? 'var(--teal-light)' : 'var(--amber)';
      })
      .attr('stroke-opacity', (d) => {
        const isFlash = flashEdge && d.from === flashEdge.from && d.to === flashEdge.to;
        return isFlash ? 1 : 0.3 + 0.5 * (d.count / maxCount);
      })
      .attr('stroke-width', (d) => 1 + (d.count / maxCount) * 4);

    const node = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => 9 + Math.min(d.count / maxCount * 4, 5))
      .attr('fill', 'var(--bg-3)')
      .attr('stroke', (d) => {
        const isFlash =
          flashEdge && (d.id === flashEdge.from || d.id === flashEdge.to);
        const isHighlight = highlightPath.includes(d.id);
        return isFlash ? '#fff' : isHighlight ? 'var(--teal-light)' : 'var(--amber)';
      })
      .attr('stroke-opacity', (d) => {
        const isFlash = flashEdge && (d.id === flashEdge.from || d.id === flashEdge.to);
        return isFlash ? 1 : 0.4;
      })
      .attr('stroke-width', (d) => {
        const isFlash = flashEdge && (d.id === flashEdge.from || d.id === flashEdge.to);
        return isFlash ? 3 : 1.5;
      });

    const label = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('font-size', 6.5)
      .attr('fill', 'var(--muted)')
      .attr('text-anchor', 'middle')
      .text((d) => MARKOV_SHORT_LABELS[d.id] ?? d.id.slice(0, 8));

    sim.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as SimNode).x ?? 0)
        .attr('y1', (d) => (d.source as SimNode).y ?? 0)
        .attr('x2', (d) => (d.target as SimNode).x ?? 0)
        .attr('y2', (d) => (d.target as SimNode).y ?? 0);
      node.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0);
      label
        .attr('x', (d) => d.x ?? 0)
        .attr('y', (d) => (d.y ?? 0) + 22);
    });

    return () => { sim.stop(); };
  }, [graphData, flashEdge, highlightPath, active]);

  if (graphData.nodes.length === 0) {
    return (
      <div className="h-[240px] bg-bg-2 border border-border rounded-lg flex items-center justify-center">
        <p className="font-mono text-min text-muted">No transitions recorded yet</p>
      </div>
    );
  }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={240}
      className="bg-bg-2 border border-border rounded-lg"
    />
  );
}
