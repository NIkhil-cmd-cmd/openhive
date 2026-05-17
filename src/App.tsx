import { lazy, Suspense } from 'react';
import { Hero } from './components/hero/Hero';

const Problem = lazy(() => import('./components/problem/Problem').then((m) => ({ default: m.Problem })));
const Solution = lazy(() => import('./components/solution/Solution').then((m) => ({ default: m.Solution })));
const Flow = lazy(() => import('./components/flow/Flow').then((m) => ({ default: m.Flow })));
const Technical = lazy(() => import('./components/technical/Technical').then((m) => ({ default: m.Technical })));
const RaceDemo = lazy(() => import('./components/raceDemo/RaceDemo').then((m) => ({ default: m.RaceDemo })));
const Results = lazy(() => import('./components/results/Results').then((m) => ({ default: m.Results })));
const CTA = lazy(() => import('./components/cta/CTA').then((m) => ({ default: m.CTA })));
const Footer = lazy(() => import('./components/footer/Footer').then((m) => ({ default: m.Footer })));

function SectionLoader() {
  return (
    <div className="slide min-h-[50vh] flex items-center justify-center font-mono text-lg text-muted">
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <>
      <main className="presentation">
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <Problem />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Solution />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Technical />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Flow />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <RaceDemo />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Results />
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
