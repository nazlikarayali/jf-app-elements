import { ComponentRegistry } from '../../types/registry';
import { ShoppingList } from './ShoppingList';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './ShoppingList.scss?raw';

ComponentRegistry.register({
  id: 'shopping-list',
  name: 'Shopping List',
  category: 'Widgets',
  icon: 'ShoppingBag',

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
    { token: 'Icon Background', variable: '--bg-surface-brand', value: '#EDE8FD', description: 'Icon container background' },
    { token: 'Icon Color', variable: '--fg-brand', value: '#7D38EF', description: 'Icon color' },
    { token: 'Progress Track', variable: '--bg-fill-active', value: '#DADEF3', description: 'Progress bar track' },
    { token: 'Progress Fill', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Progress bar fill' },
    { token: 'Checkbox Border', variable: '--border-secondary', value: '#C8CEED', description: 'Checkbox border' },
    { token: 'Checkbox Active', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Checked checkbox' },
    { token: 'Badge Background', variable: '--bg-surface-brand', value: '#EDE8FD', description: 'Items left badge' },
    { token: 'Input Border', variable: '--border-secondary', value: '#C8CEED', description: 'Input border' },
    { token: 'Add Button', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Add button background' },
  ],

  usage: `import { ShoppingList } from '@/components/ShoppingList';

// Default with preset items
<ShoppingList />

// Selected state
<ShoppingList selected />`,

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
      <ShoppingList
        selected={props['Selected'] as boolean}
      />
    );
  },
});
