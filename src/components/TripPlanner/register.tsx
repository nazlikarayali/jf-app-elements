import { ComponentRegistry } from '../../types/registry';
import { TripPlanner } from './TripPlanner';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './TripPlanner.scss?raw';

ComponentRegistry.register({
  id: 'trip-planner',
  name: 'Trip Planner',
  category: 'Widgets',
  icon: 'Map',
  variants: {},
  properties: [{ name: 'Selected', type: 'boolean', default: false }],
  states: [],
  scss,
  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: 'Widget background' },
    { token: 'Done Dot', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Completed stop dot' },
    { token: 'Done Card BG', variable: '--bg-surface-brand', value: '#EDE8FE', description: 'Completed stop card' },
    { token: 'Duration Badge', variable: '--fg-brand', value: '#7D38EF', description: 'Duration tag text' },
    { token: 'Active Day', variable: '--bg-surface-brand', value: '#EDE8FE', description: 'Active day tab' },
  ],
  usage: `<TripPlanner />\n<TripPlanner selected />`,
  propDocs: [{ name: 'selected', type: 'boolean', default: 'false', description: 'Selection outline.' }],
  render(_v: VariantValues, p: PropertyValues, _s: StateValues) {
    return <TripPlanner selected={p['Selected'] as boolean} />;
  },
});
