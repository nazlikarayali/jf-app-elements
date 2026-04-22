import { ComponentRegistry } from '../../types/registry';
import { CampCountdown } from './CampCountdown';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './CampCountdown.scss?raw';

ComponentRegistry.register({
  id: 'camp-countdown',
  name: 'Camp Countdown',
  category: 'Widgets',
  icon: 'Timer',
  variants: {},
  properties: [{ name: 'Selected', type: 'boolean', default: false }],
  states: [],
  scss,
  colorTokens: [
    { token: 'Timer BG', variable: '--bg-surface-brand', value: '#EDE8FE', description: 'Countdown area background' },
    { token: 'Numbers', variable: '--fg-brand', value: '#7D38EF', description: 'Countdown numbers' },
    { token: 'Done Dot', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Completed milestone dot' },
  ],
  usage: `<CampCountdown />\n<CampCountdown selected />`,
  propDocs: [{ name: 'selected', type: 'boolean', default: 'false', description: 'Selection outline.' }],
  render(_v: VariantValues, p: PropertyValues, _s: StateValues) {
    return <CampCountdown selected={p['Selected'] as boolean} />;
  },
});
