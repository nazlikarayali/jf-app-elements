import { ComponentRegistry } from '../../types/registry';
import { EmergencyContacts } from './EmergencyContacts';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './EmergencyContacts.scss?raw';

ComponentRegistry.register({
  id: 'emergency-contacts',
  name: 'Emergency Contacts',
  category: 'Widgets',
  icon: 'Phone',
  variants: {},
  properties: [{ name: 'Selected', type: 'boolean', default: false }],
  states: [],
  scss,
  colorTokens: [
    { token: 'Avatar BG', variable: '--bg-fill-active', value: '#DADEF3', description: 'Initials avatar background' },
    { token: 'Primary Badge', variable: '--bg-surface-success', value: '#DDFBE8', description: 'Primary contact badge' },
    { token: 'Contact Card', variable: '--bg-surface', value: '#FFFFFF', description: 'Contact card background' },
  ],
  usage: `<EmergencyContacts />\n<EmergencyContacts selected />`,
  propDocs: [{ name: 'selected', type: 'boolean', default: 'false', description: 'Selection outline.' }],
  render(_v: VariantValues, p: PropertyValues, _s: StateValues) {
    return <EmergencyContacts selected={p['Selected'] as boolean} />;
  },
});
