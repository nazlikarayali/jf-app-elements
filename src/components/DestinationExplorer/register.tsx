import { ComponentRegistry } from '../../types/registry';
import { DestinationExplorer } from './DestinationExplorer';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './DestinationExplorer.scss?raw';

ComponentRegistry.register({
  id: 'destination-explorer',
  name: 'Destination Explorer',
  category: 'Widgets',
  icon: 'MapPin',

  variants: {},

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
  ],

  states: [],

  scss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: 'Widget background' },
    { token: 'Title', variable: '--fg-primary', value: '#091141', description: 'Title text' },
    { token: 'Subtitle', variable: '--fg-disabled', value: '#979DC6', description: 'Subtitle text' },
    { token: 'Brand', variable: '--fg-brand', value: '#7D38EF', description: 'Active filter / brand color' },
    { token: 'Card Background', variable: '--bg-surface', value: '#F8F9FF', description: 'Card background' },
    { token: 'Tag Background', variable: '--bg-fill-active', value: '#DADEF3', description: 'Pill tag background' },
    { token: 'Input Border', variable: '--neutral-200', value: '#DADEF3', description: 'Input border' },
    { token: 'Star Color', variable: '', value: '#F59E0B', description: 'Star rating color' },
    { token: 'Favorite Active', variable: '', value: '#EF4444', description: 'Favorited heart color' },
  ],

  usage: `import { DestinationExplorer } from '@/components/DestinationExplorer';

<DestinationExplorer />

// Selected state
<DestinationExplorer selected />`,

  propDocs: [
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description: 'When true, shows a blue selection outline around the widget.',
    },
  ],

  render(_variants: VariantValues, props: PropertyValues, _states: StateValues) {
    return (
      <DestinationExplorer
        selected={props['Selected'] as boolean}
      />
    );
  },
});
