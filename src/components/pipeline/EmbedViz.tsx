import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface EmbedVizProps {
  active?: boolean;
}

export function EmbedViz({ active = true }: EmbedVizProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || !active) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    const w = 400;
    const h = 200;
    const colors = ['var(--amber)', 'var(--teal-light)', 'var(--muted)', 'var(--white)'];

    const nodes = d3.range(28).map((i) => ({
      id: i,
      x: w / 2 + (Math.random() - 0.5) * 100,
      y: h / 2 + (Math.random() - 0.5) * 70,
      group: i % 4,
    }));

    const sim = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('charge', d3.forceManyBody().strength(-25))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide(7))
      .alphaDecay(0.02);

    const g = svg.append('g');
    g.selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 0)
      .attr('fill', (d) => colors[d.group])
      .transition()
      .duration(500)
      .delay((_, i) => i * 20)
      .attr('r', 5);

    sim.on('tick', () => {
      g.selectAll('circle')
        .attr('cx', (d) => (d as { x: number }).x)
        .attr('cy', (d) => (d as { y: number }).y);
    });

    g.append('circle')
      .attr('r', 0)
      .attr('fill', 'var(--amber)')
      .attr('cx', 0)
      .attr('cy', h / 2)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr('r', 8)
      .attr('cx', w / 2 - 35)
      .attr('cy', h / 2);

    return () => {
      sim.stop();
    };
  }, [active]);

  return <svg ref={ref} width="100%" height={200} viewBox="0 0 400 200" className="w-full" />;
}
