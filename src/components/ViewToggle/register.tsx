import { ComponentRegistry } from '../../types/registry';
import { ViewToggle } from './ViewToggle';
import type { ViewToggleValue, ViewToggleState } from './ViewToggle';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './ViewToggle.scss?raw';

ComponentRegistry.register({
  id: 'view-toggle',
  name: 'View Toggle',
  category: 'Widget Components',
  icon: 'LayoutGrid',

  variants: {
    Active: {
      options: ['Grid', 'List'],
      default: 'Grid',
    },
  },

  properties: [],

  states: [
    { name: 'Disabled', default: false },
  ],

  scss,

  colorTokens: [
    { token: 'Container Background', variable: '--bg-fill-active', value: '#DADEF3', description: 'Toggle container background (neutral-100)' },
    { token: 'Active Button Background', variable: '--bg-surface', value: '#FFFFFF', description: 'Active button background (white)' },
    { token: 'Active Icon', variable: '--fg-primary', value: '#091141', description: 'Active icon color (neutral-900)' },
    { token: 'Inactive Icon', variable: '--fg-disabled', value: '#979DC6', description: 'Inactive icon color (neutral-300)' },
  ],

  usage: `import { ViewToggle } from '@/components/ViewToggle';

// Grid active (default)
<ViewToggle value="grid" onChange={(v) => setView(v)} />

// List active
<ViewToggle value="list" onChange={(v) => setView(v)} />

// Disabled
<ViewToggle value="grid" state="disabled" />`,

  propDocs: [
    {
      name: 'value',
      type: '"grid" | "list"',
      default: '"grid"',
      description: 'The currently active view mode.',
    },
    {
      name: 'state',
      type: '"default" | "disabled"',
      default: '"default"',
      description: 'Controls the interactive state. Disabled reduces opacity and disables interaction.',
    },
    {
      name: 'onChange',
      type: '(value: ViewToggleValue) => void',
      default: 'undefined',
      description: 'Callback fired when a toggle button is clicked.',
    },
  ],

  render(variants: VariantValues, _props: PropertyValues, states: StateValues): React.ReactNode {
    const valueMap: Record<string, ViewToggleValue> = {
      Grid: 'grid',
      List: 'list',
    };

    const state: ViewToggleState = states['Disabled'] ? 'disabled' : 'default';

    return (
      <ViewToggle
        value={valueMap[variants['Active']] || 'grid'}
        state={state}
      />
    );
  },
});
