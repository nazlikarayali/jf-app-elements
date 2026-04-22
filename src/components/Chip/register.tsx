import { ComponentRegistry } from '../../types/registry';
import { Chip } from './Chip';
import type { ChipState } from './Chip';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './Chip.scss?raw';

ComponentRegistry.register({
  id: 'chip',
  name: 'Chip',
  category: 'Widget Components',
  icon: 'Hash',

  variants: {},

  properties: [
    { name: 'Label', type: 'text', default: 'Chip' },
  ],

  states: [
    { name: 'Active', default: false },
    { name: 'Hovered', default: false },
    { name: 'Disabled', default: false },
  ],

  scss,

  colorTokens: [
    { token: 'Border', variable: '--border', value: '#DADEF3', description: 'Default border color (neutral-100)' },
    { token: 'Background', variable: '--bg-surface', value: '#FFFFFF', description: 'Default background' },
    { token: 'Text', variable: '--fg-secondary', value: '#353C6A', description: 'Default text color (neutral-600)' },
    { token: 'Active Border', variable: '--fg-brand', value: '#7D38EF', description: 'Active/hover border (primary-600)' },
    { token: 'Active Background', variable: '--bg-surface-brand', value: '#EDE8FE', description: 'Active background (primary-100)' },
    { token: 'Active Text', variable: '--fg-brand', value: '#7D38EF', description: 'Active text color (primary-600)' },
  ],

  usage: `import { Chip } from '@/components/Chip';

// Default
<Chip label="Option" />

// Active
<Chip label="Selected" state="active" />

// Interactive
<Chip label="Toggle" onChange={(active) => console.log(active)} />

// Disabled
<Chip label="Disabled" state="disabled" />`,

  propDocs: [
    { name: 'label', type: 'string', default: '"Chip"', description: 'The chip text label.' },
    { name: 'state', type: '"default" | "hover" | "active" | "disabled"', default: '"default"', description: 'Controls the visual state.' },
    { name: 'onChange', type: '(active: boolean) => void', default: 'undefined', description: 'Callback when chip is clicked.' },
  ],

  render(_variants: VariantValues, props: PropertyValues, states: StateValues): React.ReactNode {
    let state: ChipState = 'default';
    if (states['Disabled']) state = 'disabled';
    else if (states['Active']) state = 'active';
    else if (states['Hovered']) state = 'hover';

    return (
      <Chip
        label={props['Label'] as string}
        state={state}
      />
    );
  },
});
