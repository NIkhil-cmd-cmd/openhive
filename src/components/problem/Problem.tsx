import { Slide } from '../ui/Slide';
import { ProblemGraph } from './ProblemGraph';

export function Problem() {
  return (
    <Slide id="problem" step="02" label="Problem" title="TODAY, EVERY AGENT RUNS ALONE.">
      <p className="text-body-lg text-white max-w-5xl mb-12 leading-relaxed">
        Agent A learns the right tool path — Agent B still starts blind and burns tokens re-discovering it.
        Nothing carries over. You pay for the same failures on every run.
      </p>
      <ProblemGraph />
    </Slide>
  );
}
