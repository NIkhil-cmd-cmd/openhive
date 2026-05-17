import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NODES = ['START', 'web_search', 'smart_home', 'confirm', 'END'];
const LINKS = [
  { source: 'START', target: 'web_search', prob: 0.6 },
  { source: 'START', target: 'smart_home', prob: 0.4 },
  { source: 'web_search', target: 'confirm', prob: 0.7 },
  { source: 'smart_home', target: 'confirm', prob: 0.8 },
  { source: 'confirm', target: 'END', prob: 1 },
];
const PATH = ['START', 'web_search', 'confirm', 'END'];

interface MarkovVizProps {
  active?: boolean;
}

export function MarkovViz({ active = true }: MarkovVizProps) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || !active) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    const w = 400;
    const h = 180;

    const nodeData = NODES.map((id, i) => ({
      id,
      x: 40 + (i / (NODES.length - 1)) * (w - 80),
      y: h / 2 + (i % 2 === 0 ? -22 : 22),
    }));

    svg
      .selectAll('line')
      .data(LINKS)
      .join('line')
      .attr('x1', (d) => nodeData.find((n) => n.id === d.source)!.x)
      .attr('y1', (d) => nodeData.find((n) => n.id === d.source)!.y)
      .attr('x2', (d) => nodeData.find((n) => n.id === d.target)!.x)
      .attr('y2', (d) => nodeData.find((n) => n.id === d.target)!.y)
      .attr('stroke', 'var(--amber)')
      .attr('stroke-opacity', 0)
      .attr('stroke-width', (d) => d.prob * 5)
      .transition()
      .duration(600)
      .delay((_, i) => i * 80)
      .attr('stroke-opacity', 0.45);

    svg
      .selectAll('circle.node')
      .data(nodeData)
      .join('circle')
      .attr('r', 0)
      .attr('fill', 'var(--bg-3)')
      .attr('stroke', 'var(--amber)')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .transition()
      .duration(400)
      .delay((_, i) => 200 + i * 60)
      .attr('r', 11);

    svg
      .selectAll('text')
      .data(nodeData)
      .join('text')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y + 26)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--muted)')
      .attr('font-size', 8)
      .attr('opacity', 0)
      .text((d) => d.id)
      .transition()
      .duration(300)
      .delay(500)
      .attr('opacity', 1);

    const dot = svg.append('circle').attr('r', 6).attr('fill', 'var(--amber)');
    let step = 0;

    const interval = setInterval(() => {
      const id = PATH[step % PATH.length];
      const n = nodeData.find((x) => x.id === id)!;
      dot
        .transition()
        .duration(450)
        .ease(d3.easeCubicInOut)
        .attr('cx', n.x)
        .attr('cy', n.y);
      step++;
    }, 1100);

    return () => clearInterval(interval);
  }, [active]);

  return <svg ref={ref} width="100%" height={180} viewBox="0 0 400 180" className="w-full" />;
}
