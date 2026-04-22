import { ComponentRegistry } from '../../types/registry';
import { RegistrationProgress } from './RegistrationProgress';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './RegistrationProgress.scss?raw';

ComponentRegistry.register({
  id: 'registration-progress',
  name: 'Registration Progress',
  category: 'Widgets',
  icon: 'ClipboardList',
  variants: {},
  properties: [{ name: 'Selected', type: 'boolean', default: false }],
  states: [],
  scss,
  colorTokens: [
    { token: 'Progress Bar', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Progress fill' },
    { token: 'Completed', variable: '--bg-surface-success', value: '#DDFBE8', description: 'Completed form bg' },
    { token: 'In Progress', variable: '--bg-surface-info', value: '#DDF3FF', description: 'In progress form bg' },
    { token: 'Not Started', variable: '--bg-surface-warning', value: '#FEF3C5', description: 'Not started form bg' },
    { token: 'Open Form', variable: '--fg-brand', value: '#7D38EF', description: 'Open form button' },
    { token: 'Callout', variable: '--bg-surface-info', value: '#DDF3FF', description: 'Next step callout bg' },
  ],
  usage: `<RegistrationProgress />\n<RegistrationProgress selected />`,
  propDocs: [{ name: 'selected', type: 'boolean', default: 'false', description: 'Selection outline.' }],
  render(_v: VariantValues, p: PropertyValues, _s: StateValues) {
    return <RegistrationProgress selected={p['Selected'] as boolean} />;
  },
});
