import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import type { MarkovState } from '../../lib/markov';
import type { BucketKey } from '../../lib/simulation';
import { BUCKETS } from '../../lib/simulation';

interface MarkovGraphProps {
  bucket: BucketKey;
  state: MarkovState;
  flashEdge?: { from: string; to: string };
  active?: boolean;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  count: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  count: number;
}

export function MarkovGraph({ bucket, state, flashEdge, active = true }: MarkovGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const path = BUCKETS[bucket].markovPath;

  const graphData = useMemo(() => {
    const nodes = new Set<string>();
    path.forEach((n) => nodes.add(n));
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
    }));
    return { nodes: nodeList, links };
  }, [state, path]);

  useEffect(() => {
    if (!svgRef.current || !active) return;
    const svg = d3.select(svgRef.current);
    const w = svgRef.current.clientWidth || 280;
    const h = 240;
    svg.attr('viewBox', `0 0 ${w} ${h}`);
    svg.selectAll('*').remove();

    const nodes = graphData.nodes.map((n) => ({ ...n }));
    const links = graphData.links.map((l) => ({ ...l }));

    const sim = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink<SimNode, SimLink>(links).id((d) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(w / 2, h / 2));

    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'var(--amber)')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', (d) => Math.min(6, 1 + d.count * 0.5));

    const node = svg
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => 8 + Math.min(d.count, 10))
      .attr('fill', 'var(--bg-3)')
      .attr('stroke', (d) =>
        flashEdge && (d.id === flashEdge.from || d.id === flashEdge.to)
          ? 'var(--amber)'
          : 'var(--muted)'
      )
      .attr('stroke-width', (d) =>
        flashEdge && (d.id === flashEdge.from || d.id === flashEdge.to) ? 3 : 1
      );

    const label = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('font-size', 7)
      .attr('fill', 'var(--muted)')
      .attr('text-anchor', 'middle')
      .text((d) => d.id.slice(0, 8));

    sim.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as SimNode).x ?? 0)
        .attr('y1', (d) => (d.source as SimNode).y ?? 0)
        .attr('x2', (d) => (d.target as SimNode).x ?? 0)
        .attr('y2', (d) => (d.target as SimNode).y ?? 0);
      node.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0);
      label.attr('x', (d) => d.x ?? 0).attr('y', (d) => (d.y ?? 0) + 20);
    });

    return () => {
      sim.stop();
    };
  }, [graphData, flashEdge, active]);

  return <svg ref={svgRef} width="100%" height={240} className="bg-bg-2 border border-border rounded-lg" />;
}
