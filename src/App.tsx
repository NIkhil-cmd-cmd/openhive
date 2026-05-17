import { lazy, Suspense } from 'react';
import { Nav } from './components/nav/Nav';
import { Hero } from './components/hero/Hero';

const Problem = lazy(() => import('./components/problem/Problem').then((m) => ({ default: m.Problem })));
const Solution = lazy(() => import('./components/solution/Solution').then((m) => ({ default: m.Solution })));
const Pipeline = lazy(() => import('./components/pipeline/Pipeline').then((m) => ({ default: m.Pipeline })));
const Technical = lazy(() => import('./components/technical/Technical').then((m) => ({ default: m.Technical })));
const RaceDemo = lazy(() => import('./components/raceDemo/RaceDemo').then((m) => ({ default: m.RaceDemo })));
const Demo = lazy(() => import('./components/demo/Demo').then((m) => ({ default: m.Demo })));
const BuiltOn = lazy(() => import('./components/builtOn/BuiltOn').then((m) => ({ default: m.BuiltOn })));
const CTA = lazy(() => import('./components/cta/CTA').then((m) => ({ default: m.CTA })));
const Footer = lazy(() => import('./components/footer/Footer').then((m) => ({ default: m.Footer })));

function SectionLoader() {
  return <div className="py-24 text-center font-mono text-muted">Loading…</div>;
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <Problem />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Solution />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Pipeline />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Technical />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <RaceDemo />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Demo />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <BuiltOn />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <CTA />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
      </main>
    </>
  );
}
