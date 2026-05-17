import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

const DATA = [
  { label: 'Without OpenHive', calls: 28, sub: '3 siloed agents · no transfer' },
  { label: 'With OpenHive', calls: 8, sub: 'shared memory · one path' },
];

const FONT_MIN = 18;

export function ProblemGraph() {
  const ref = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !wrapRef.current) return;

    const width = wrapRef.current.clientWidth;
    const height = 380;
    const margin = { top: 32, right: 32, bottom: 100, left: 72 };

    const svg = d3.select(ref.current).attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(DATA.map((d) => d.label))
      .range([0, innerW])
      .padding(0.35);

    const y = d3
      .scaleLinear()
      .domain([0, 32])
      .range([innerH, 0]);

    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll('text')
      .attr('fill', 'var(--white)')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('font-size', FONT_MIN)
      .attr('font-weight', 600);

    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickFormat((d) => `${d}`))
      .selectAll('text')
      .attr('fill', 'var(--muted)')
      .attr('font-family', 'DM Mono, monospace')
      .attr('font-size', FONT_MIN);

    g.selectAll('.domain, .tick line').attr('stroke', 'rgba(245,166,35,0.25)');

    g.append('text')
      .attr('x', -margin.left + 12)
      .attr('y', -12)
      .attr('fill', 'var(--muted)')
      .attr('font-family', 'DM Mono, monospace')
      .attr('font-size', FONT_MIN)
      .text('Tool calls per task');

    const bars = g
      .selectAll('rect.bar')
      .data(DATA)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.label)!)
      .attr('y', innerH)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('rx', 8)
      .attr('fill', (_, i) => (i === 0 ? 'rgba(122,122,140,0.85)' : 'var(--amber)'));

    bars
      .transition()
      .duration(900)
      .delay((_, i) => i * 200)
      .attr('y', (d) => y(d.calls))
      .attr('height', (d) => innerH - y(d.calls));

    g.selectAll('text.value')
      .data(DATA)
      .join('text')
      .attr('class', 'value')
      .attr('x', (d) => x(d.label)! + x.bandwidth() / 2)
      .attr('y', (d) => y(d.calls) - 16)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--white)')
      .attr('font-family', 'Bebas Neue, Impact, sans-serif')
      .attr('font-size', 48)
      .attr('opacity', 0)
      .text((d) => d.calls)
      .transition()
      .duration(600)
      .delay((_, i) => 400 + i * 200)
      .attr('opacity', 1);

    g.selectAll('text.sub')
      .data(DATA)
      .join('text')
      .attr('class', 'sub')
      .attr('x', (d) => x(d.label)! + x.bandwidth() / 2)
      .attr('y', innerH + 56)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--muted)')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('font-size', FONT_MIN)
      .text((d) => d.sub);

    const siloX = x(DATA[0].label)! + x.bandwidth() / 2;
    const siloY = y(28) - 12;
    [-36, 0, 36].forEach((dx, i) => {
      g.append('circle')
        .attr('cx', siloX + dx)
        .attr('cy', siloY)
        .attr('r', 14)
        .attr('fill', 'none')
        .attr('stroke', 'var(--muted)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5 4')
        .attr('opacity', 0.8);
      g.append('text')
        .attr('x', siloX + dx)
        .attr('y', siloY + 36)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--muted)')
        .attr('font-size', FONT_MIN)
        .attr('font-family', 'DM Mono, monospace')
        .text(`A${i + 1}`);
    });
  }, []);

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="panel p-8 md:p-12 w-full"
    >
      <svg ref={ref} className="w-full block" role="img" aria-label="Tool calls: 28 without OpenHive vs 8 with OpenHive" />
      <p className="text-stat text-center text-amber mt-8">3.5× fewer calls</p>
    </motion.div>
  );
}
