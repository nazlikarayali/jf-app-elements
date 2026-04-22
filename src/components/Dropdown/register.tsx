import { ComponentRegistry } from '../../types/registry';
import { Dropdown } from './Dropdown';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './Dropdown.scss?raw';

ComponentRegistry.register({
  id: 'dropdown',
  name: 'Dropdown',
  category: 'Widget Components',
  icon: 'ChevronDown',

  variants: {
    Size: {
      options: ['Small', 'Medium'],
      default: 'Medium',
    },
  },

  properties: [
    { name: 'Label', type: 'text', default: 'Label' },
    { name: 'Description', type: 'text', default: 'Select an option from the list' },
    { name: 'Placeholder', type: 'text', default: 'Select...' },
    { name: 'Selected Value', type: 'text', default: 'Option 2' },
  ],

  states: [
    { name: 'Open', default: false },
    { name: 'Focused', default: false },
    { name: 'Disabled', default: false },
  ],

  scss,

  colorTokens: [
    { token: 'Label', variable: '--fg-secondary', value: '#353C6A', description: 'Label text color (neutral-700)' },
    { token: 'Value Text', variable: '--fg-primary', value: '#091141', description: 'Selected value text color (neutral-900)' },
    { token: 'Placeholder', variable: '--fg-disabled', value: '#979DC6', description: 'Placeholder text color (neutral-300)' },
    { token: 'Border', variable: '--border', value: '#DADEF3', description: 'Trigger border color (neutral-100)' },
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: 'Trigger background color' },
    { token: 'Focus Border', variable: '--fg-brand', value: '#7D38EF', description: 'Focused border color (primary-600)' },
    { token: 'Panel BG', variable: '--bg-surface', value: '#FFFFFF', description: 'Dropdown panel background' },
    { token: 'Option Hover', variable: '--bg-surface-hover', value: '#F3F3FE', description: 'Option hover background (neutral-50)' },
    { token: 'Selected BG', variable: '--bg-surface-brand', value: '#EDE8FE', description: 'Selected option background (primary-100)' },
    { token: 'Selected Text', variable: '--fg-brand', value: '#7D38EF', description: 'Selected option text color (primary-600)' },
    { token: 'Chevron', variable: '--fg-disabled', value: '#979DC6', description: 'Chevron icon color (neutral-300)' },
  ],

  usage: `import { Dropdown } from '@/components/Dropdown';

// Basic dropdown
<Dropdown
  label="Country"
  placeholder="Select a country..."
  options={['USA', 'Canada', 'UK', 'Germany']}
/>

// With selected value
<Dropdown
  label="Size"
  selectedValue="Medium"
  options={['Small', 'Medium', 'Large']}
/>

// Open state
<Dropdown
  label="Category"
  selectedValue="Option 2"
  options={['Option 1', 'Option 2', 'Option 3']}
  open={true}
/>

// Disabled state
<Dropdown
  label="Status"
  placeholder="Select..."
  state="disabled"
/>`,

  propDocs: [
    {
      name: 'label',
      type: 'string',
      default: '"Label"',
      description:
        'Text label displayed above the dropdown trigger. Rendered with 12px medium weight in `--fg-secondary` color.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: '"Select..."',
      description:
        'Placeholder text shown when no value is selected. Displayed in `--fg-disabled` color.',
    },
    {
      name: 'selectedValue',
      type: 'string',
      default: '""',
      description:
        'The currently selected option value. When set, the matching option in the dropdown panel is highlighted with `--bg-surface-brand` background.',
    },
    {
      name: 'options',
      type: 'string[]',
      default: '["Option 1", "Option 2", "Option 3"]',
      description:
        'Array of option strings displayed in the dropdown panel. Each option is rendered as a selectable item.',
    },
    {
      name: 'open',
      type: 'boolean',
      default: 'false',
      description:
        'Controls whether the dropdown panel is visible. When `true`, the chevron rotates 180 degrees and the options panel is displayed.',
    },
    {
      name: 'state',
      type: '"default" | "focused" | "disabled"',
      default: '"default"',
      description:
        'Controls the interactive state. **Focused** applies a brand-colored border and focus ring. **Disabled** reduces opacity to 0.6 and prevents interaction.',
    },
    {
      name: 'size',
      type: '"sm" | "md"',
      default: '"md"',
      description:
        'Controls the trigger height. **sm** renders at 40px height, **md** at 44px.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      default: 'undefined',
      description:
        'Callback fired when an option is clicked. Receives the selected option string as its argument.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, states: StateValues): React.ReactNode {
    let state: 'default' | 'focused' | 'disabled' = 'default';
    if (states['Disabled']) state = 'disabled';
    else if (states['Focused']) state = 'focused';

    const sizeMap: Record<string, 'sm' | 'md'> = {
      Small: 'sm',
      Medium: 'md',
    };

    return (
      <Dropdown
        label={props['Label'] as string}
        description={props['Description'] as string}
        placeholder={props['Placeholder'] as string}
        selectedValue={props['Selected Value'] as string}
        options={['Option 1', 'Option 2', 'Option 3']}
        open={states['Open']}
        state={state}
        size={sizeMap[variants['Size']] || 'md'}
      />
    );
  },
});
