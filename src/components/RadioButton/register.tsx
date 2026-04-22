import { ComponentRegistry } from '../../types/registry';
import { RadioButton } from './RadioButton';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './RadioButton.scss?raw';

ComponentRegistry.register({
  id: 'radio-button',
  name: 'Radio Button',
  category: 'Widget Components',
  icon: 'Circle',

  variants: {
    Size: {
      options: ['Small', 'Medium'],
      default: 'Medium',
    },
  },

  properties: [
    { name: 'Label', type: 'text', default: 'Radio option' },
    { name: 'Checked', type: 'boolean', default: false },
  ],

  states: [
    { name: 'Hovered', default: false },
    { name: 'Disabled', default: false },
  ],

  scss,

  colorTokens: [
    { token: 'Border', variable: '--border-secondary', value: '#C8CEED', description: 'Default circle border color' },
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: 'Circle background (unchecked)' },
    { token: 'Checked Fill', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Circle fill when checked (primary-600)' },
    { token: 'Inner Dot', variable: '--fg-inverse', value: '#FFFFFF', description: 'Inner dot color (white)' },
    { token: 'Hover Border', variable: '--border-active', value: '#C8CEED', description: 'Circle border on hover' },
    { token: 'Label', variable: '--fg-primary', value: '#091141', description: 'Label text color (neutral-900)' },
  ],

  usage: `import { RadioButton } from '@/components/RadioButton';

// Default radio button
<RadioButton label="Radio option" />

// Checked radio button
<RadioButton label="Selected option" checked={true} />

// Small size
<RadioButton label="Small radio" size="sm" />

// Disabled state
<RadioButton label="Disabled option" state="disabled" />

// Disabled and checked
<RadioButton label="Disabled selected" checked={true} state="disabled" />`,

  propDocs: [
    {
      name: 'label',
      type: 'string',
      default: '"Radio option"',
      description:
        'The text label displayed next to the radio circle. Rendered with 14px regular weight for medium size, 12px for small size.',
    },
    {
      name: 'checked',
      type: 'boolean',
      default: 'false',
      description:
        'Controls whether the radio button is selected. When `true`, the circle fills with the brand color (`bg-fill-brand`) and shows a white inner dot.',
    },
    {
      name: 'state',
      type: '"default" | "hover" | "disabled"',
      default: '"default"',
      description:
        'Controls the interactive state. **hover** applies the hover border style. **disabled** reduces opacity to 0.5 and disables pointer events.',
    },
    {
      name: 'size',
      type: '"sm" | "md"',
      default: '"md"',
      description:
        'Controls the size of the radio circle. **sm** renders a 16x16px circle with a 6px inner dot. **md** renders a 20x20px circle with an 8px inner dot.',
    },
    {
      name: 'onChange',
      type: '() => void',
      default: 'undefined',
      description:
        'Callback function fired when the radio button is clicked. Not called when the component is disabled.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, states: StateValues): React.ReactNode {
    const sizeMap: Record<string, 'sm' | 'md'> = { Small: 'sm', Medium: 'md' };
    const size = sizeMap[variants['Size']] || 'md';

    let state: 'default' | 'hover' | 'disabled' = 'default';
    if (states['Disabled']) state = 'disabled';
    else if (states['Hovered']) state = 'hover';

    return (
      <RadioButton
        label={props['Label'] as string}
        checked={props['Checked'] as boolean}
        size={size}
        state={state}
      />
    );
  },
});
