import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import type { MemoryPoint } from '../../lib/simulation';
import { BUCKET_COLORS } from '../../lib/simulation';

interface ClusterMapProps {
  memories: MemoryPoint[];
  active?: boolean;
}

export function ClusterMap({ memories, active = true }: ClusterMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const data = useMemo(() => memories, [memories]);

  useEffect(() => {
    if (!svgRef.current || !active) return;
    const svg = d3.select(svgRef.current);
    const w = svgRef.current.clientWidth || 400;
    const h = 280;

    svg.attr('viewBox', `0 0 ${w} ${h}`);
    svg.selectAll('*').remove();

    const xScale = d3.scaleLinear().domain([-120, 120]).range([40, w - 40]);
    const yScale = d3.scaleLinear().domain([-120, 120]).range([40, h - 40]);

    if (data.length >= 4) {
      const points = data.map((d) => [xScale(d.x), yScale(d.y)] as [number, number]);
      const delaunay = d3.Delaunay.from(points);
      const vor = delaunay.voronoi([0, 0, w, h]);
      const buckets = [...new Set(data.map((d) => d.bucket))];

      buckets.forEach((bucket) => {
        const indices = data.map((d, i) => (d.bucket === bucket ? i : -1)).filter((i) => i >= 0);
        if (indices.length === 0) return;
        const path = indices
          .map((i) => vor.renderCell(i))
          .filter(Boolean)
          .join(' ');
        if (path) {
          svg
            .append('path')
            .attr('d', path)
            .attr('fill', BUCKET_COLORS[bucket] ?? 'var(--muted)')
            .attr('fill-opacity', 0.08)
            .attr('stroke', 'none');
        }
      });
    }

    svg
      .selectAll('circle.mem')
      .data(data)
      .join('circle')
      .attr('class', 'mem')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', 5)
      .attr('fill', (d) => BUCKET_COLORS[d.bucket] ?? 'var(--muted)')
      .attr('stroke', 'var(--bg)')
      .attr('stroke-width', 1)
      .append('title')
      .text((d) => `${d.agentId}: ${d.prompt}`);

    svg
      .append('text')
      .attr('x', w / 2)
      .attr('y', h - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--muted)')
      .attr('font-size', 10)
      .text('← Embedding Dimension 1 →');

    svg
      .append('text')
      .attr('x', 12)
      .attr('y', h / 2)
      .attr('fill', 'var(--muted)')
      .attr('font-size', 10)
      .attr('transform', `rotate(-90, 12, ${h / 2})`)
      .text('← Dim 2 →');
  }, [data, active]);

  return (
    <div className="relative w-full h-[280px] bg-bg-2 border border-border rounded-lg overflow-hidden">
      <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-2 z-10 font-mono text-[10px]">
        {Object.entries(BUCKET_COLORS).slice(0, 4).map(([k, c]) => (
          <span key={k} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: c }} />
            {k}
          </span>
        ))}
      </div>
      <svg ref={svgRef} width="100%" height="100%" />
    </div>
  );
}
