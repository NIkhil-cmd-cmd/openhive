import { Slide } from '../ui/Slide';
import { HiveMindDiagram } from '../pipeline/HiveMindDiagram';

export function Flow() {
  return (
    <Slide
      id="flow"
      step="05"
      label="Architecture"
      title="HOW OPENHIVE ROUTES AGENTS."
      tone="elevated"
      innerClassName="max-w-7xl"
    >
      <HiveMindDiagram />
    </Slide>
  );
}
