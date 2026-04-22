import { ComponentRegistry } from '../../types/registry';
import { CampFeedback } from './CampFeedback';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './CampFeedback.scss?raw';

ComponentRegistry.register({
  id: 'camp-feedback',
  name: 'Camp Feedback',
  category: 'Widgets',
  icon: 'MessageCircle',
  variants: {},
  properties: [{ name: 'Selected', type: 'boolean', default: false }],
  states: [],
  scss,
  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: 'Widget background' },
    { token: 'Active Mood', variable: '--bg-surface-brand', value: '#EDE8FE', description: 'Selected mood bg' },
    { token: 'Bar Fill', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Distribution bar fill' },
    { token: 'Submit', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Send button' },
    { token: 'Success', variable: '--bg-surface-success', value: '#DDFBE8', description: 'Success message bg' },
  ],
  usage: `<CampFeedback />\n<CampFeedback selected />`,
  propDocs: [{ name: 'selected', type: 'boolean', default: 'false', description: 'Selection outline.' }],
  render(_v: VariantValues, p: PropertyValues, _s: StateValues) {
    return <CampFeedback selected={p['Selected'] as boolean} />;
  },
});
