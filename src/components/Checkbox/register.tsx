import { ComponentRegistry } from '../../types/registry';
import { Checkbox } from './Checkbox';
import type { CheckboxSize, CheckboxState } from './Checkbox';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './Checkbox.scss?raw';

ComponentRegistry.register({
  id: 'checkbox',
  name: 'Checkbox',
  category: 'Widget Components',
  icon: 'CheckSquare',

  variants: {
    Size: {
      options: ['Small', 'Medium'],
      default: 'Medium',
    },
  },

  properties: [
    { name: 'Label', type: 'text', default: 'Checkbox label' },
    { name: 'Checked', type: 'boolean', default: false },
    { name: 'Indeterminate', type: 'boolean', default: false },
  ],

  states: [
    { name: 'Hovered', default: false },
    { name: 'Disabled', default: false },
  ],

  scss,

  colorTokens: [
    { token: 'Box Border', variable: '--border-secondary', value: '#C8CEED', description: 'Default checkbox border color' },
    { token: 'Box Background', variable: '--bg-fill', value: '#FFFFFF', description: 'Default checkbox fill' },
    { token: 'Checked Fill', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Checked / indeterminate fill (primary-600)' },
    { token: 'Checkmark', variable: '--fg-inverse', value: '#FFFFFF', description: 'Checkmark / dash icon color' },
    { token: 'Hover Border', variable: '--border-active', value: '#C8CEED', description: 'Border color on hover' },
    { token: 'Label Color', variable: '--fg-primary', value: '#091141', description: 'Label text color (neutral-900)' },
  ],

  usage: `import { Checkbox } from '@/components/Checkbox';

// Default unchecked checkbox
<Checkbox label="Accept terms" />

// Checked checkbox
<Checkbox label="Remember me" checked={true} />

// Indeterminate state (e.g. partial selection)
<Checkbox label="Select all" indeterminate={true} />

// Small size
<Checkbox label="Small option" size="sm" />

// Disabled checkbox
<Checkbox label="Not available" state="disabled" />

// Disabled and checked
<Checkbox label="Locked option" checked={true} state="disabled" />`,

  propDocs: [
    {
      name: 'label',
      type: 'string',
      default: '"Checkbox label"',
      description:
        'The text label displayed next to the checkbox box. Rendered with `Label/Medium` typography (14px, regular weight for md; 12px for sm).',
    },
    {
      name: 'checked',
      type: 'boolean',
      default: 'false',
      description:
        'Controls whether the checkbox is checked. When `true`, the box fills with `bg-fill-brand` and displays a white checkmark SVG.',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, the checkbox shows an indeterminate (dash) state. Takes visual priority over `checked`. The box fills with `bg-fill-brand` and displays a horizontal dash.',
    },
    {
      name: 'state',
      type: '"default" | "hover" | "disabled"',
      default: '"default"',
      description:
        'Controls the interactive state. **hover** applies the hover border style. **disabled** reduces opacity to 0.5 and prevents interaction.',
    },
    {
      name: 'size',
      type: '"sm" | "md"',
      default: '"md"',
      description:
        'Controls the checkbox size. **sm** renders a 16x16 box with 12px label text. **md** renders a 20x20 box with 14px label text.',
    },
    {
      name: 'onChange',
      type: '(checked: boolean) => void',
      default: 'undefined',
      description:
        'Callback fired when the checkbox is clicked. Receives the new checked value. Not called when disabled.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, states: StateValues): React.ReactNode {
    let state: CheckboxState = 'default';
    if (states['Disabled']) state = 'disabled';
    else if (states['Hovered']) state = 'hover';

    const sizeMap: Record<string, CheckboxSize> = {
      Small: 'sm',
      Medium: 'md',
    };

    return (
      <Checkbox
        label={props['Label'] as string}
        checked={props['Checked'] as boolean}
        indeterminate={props['Indeterminate'] as boolean}
        state={state}
        size={sizeMap[variants['Size']] || 'md'}
      />
    );
  },
});
