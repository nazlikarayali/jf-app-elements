import { ComponentRegistry } from '../../types/registry';
import { CamperCard } from './CamperCard';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './CamperCard.scss?raw';

ComponentRegistry.register({
  id: 'camper-card',
  name: 'Camper Card',
  category: 'Widgets',
  icon: 'UserRound',

  variants: {},

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
  ],

  states: [],

  scss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: 'Card background' },
    { token: 'Name', variable: '--fg-primary', value: '#091141', description: 'Camper name text' },
    { token: 'Meta', variable: '--fg-disabled', value: '#979DC6', description: 'Age and cabin text' },
    { token: 'Avatar BG', variable: '--bg-surface-brand', value: '#EDE8FE', description: 'Avatar background' },
    { token: 'Progress Bar', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Progress fill' },
    { token: 'Status Ready', variable: '--bg-surface-success', value: '#DDFBE8', description: 'Ready badge background' },
    { token: 'Allergy Tag', variable: '--bg-surface-error', value: '#FEF2F2', description: 'Allergy tag background' },
    { token: 'Form Check', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Completed form checkbox' },
  ],

  usage: `import { CamperCard } from '@/components/CamperCard';

<CamperCard />
<CamperCard selected />`,

  propDocs: [
    { name: 'selected', type: 'boolean', default: 'false', description: 'Shows selection outline.' },
  ],

  render(_variants: VariantValues, props: PropertyValues, _states: StateValues) {
    return <CamperCard selected={props['Selected'] as boolean} />;
  },
});
