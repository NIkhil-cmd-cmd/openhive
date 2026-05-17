import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { Section } from '../ui/Section';
import { ProblemCard } from './ProblemCard';

function BlindToolViz() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    const nodes = d3.range(5).map((i) => ({ x: 20 + i * 20, y: 40 + (Math.random() - 0.5) * 30 }));
    nodes.forEach((n, i) => {
      const target = nodes[(i + 2) % nodes.length];
      svg
        .append('line')
        .attr('x1', n.x)
        .attr('y1', n.y)
        .attr('x2', target.x)
        .attr('y2', target.y)
        .attr('stroke', 'var(--amber)')
        .attr('stroke-opacity', 0.4);
    });
    nodes.forEach((n) => {
      svg.append('circle').attr('cx', n.x).attr('cy', n.y).attr('r', 4).attr('fill', 'var(--amber)');
    });
  }, []);
  return <svg ref={ref} width={120} height={80} />;
}

function IsolatedAgentsViz() {
  return (
    <svg width={120} height={80} viewBox="0 0 120 80">
      {[25, 60, 95].map((x) => (
        <circle key={x} cx={x} cy={40} r={14} fill="none" stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="4 4" />
      ))}
    </svg>
  );
}

function WasteChartViz() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    const data = [30, 55, 78, 92];
    const x = d3.scaleBand().domain(d3.range(data.length).map(String)).range([10, 110]).padding(0.3);
    const y = d3.scaleLinear().domain([0, 100]).range([70, 10]);
    svg
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (_, i) => x(String(i))!)
      .attr('y', (d) => y(d)!)
      .attr('width', x.bandwidth())
      .attr('height', (d) => 70 - y(d)!)
      .attr('fill', (_, i) => (i === 3 ? 'var(--amber)' : 'var(--muted)'))
      .attr('opacity', 0.85);
  }, []);
  return <svg ref={ref} width={120} height={80} />;
}

export function Problem() {
  return (
    <Section id="problem">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="font-display text-5xl md:text-6xl text-white text-center leading-tight mb-14"
      >
        EVERY AGENT STARTS FROM ZERO.
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-5 mb-16">
        <ProblemCard
          title="Blind Tool Calling"
          description="Agents explore tool sequences at random, burning tokens on dead ends. No shared experience means repeated failures."
          icon={<BlindToolViz />}
        />
        <ProblemCard
          title="No Cross-Agent Learning"
          description="Agent A solves a problem. Agent B starts from scratch. Combined experience lives nowhere."
          icon={<IsolatedAgentsViz />}
        />
        <ProblemCard
          title="Token Waste at Scale"
          description="3–7× more tool calls than necessary — orders of magnitude more cost, latency, and errors."
          icon={<WasteChartViz />}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center panel py-10 px-6"
      >
        <p className="font-display text-7xl md:text-8xl text-amber leading-none">3–7×</p>
        <p className="font-mono text-sm text-muted mt-3">
          wasted tool calls per prompt in naive multi-agent systems
        </p>
      </motion.div>
    </Section>
  );
}
