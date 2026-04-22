import { ComponentRegistry } from '../../types/registry';
import { InputField } from './InputField';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './InputField.scss?raw';

ComponentRegistry.register({
  id: 'input-field',
  name: 'Input Field',
  category: 'Widget Components',
  icon: 'TextCursorInput',

  variants: {
    Size: {
      options: ['Small', 'Medium'],
      default: 'Medium',
    },
  },

  properties: [
    { name: 'Label', type: 'text', default: 'Label' },
    { name: 'Placeholder', type: 'text', default: 'Placeholder...' },
    { name: 'Value', type: 'text', default: '' },
    { name: 'Helper Text', type: 'text', default: 'Helper text' },
  ],

  states: [
    { name: 'Focused', default: false },
    { name: 'Error', default: false },
    { name: 'Disabled', default: false },
  ],

  scss,

  colorTokens: [
    { token: 'Label', variable: '--fg-secondary', value: '#353C6A', description: 'Label text color (neutral-700)' },
    { token: 'Input Text', variable: '--fg-primary', value: '#091141', description: 'Input value text color (neutral-900)' },
    { token: 'Placeholder', variable: '--fg-disabled', value: '#979DC6', description: 'Placeholder text color (neutral-300)' },
    { token: 'Border', variable: '--border-secondary', value: '#C8CEED', description: 'Default border color (neutral-200)' },
    { token: 'Background', variable: '--bg-surface', value: '#FFFFFF', description: 'Input background color' },
    { token: 'Focus Border', variable: '--fg-brand', value: '#7D38EF', description: 'Focused border color (primary-600)' },
    { token: 'Focus Ring', variable: '--bg-surface-brand', value: '#EDE8FE', description: 'Focus ring color (primary-50)' },
    { token: 'Error Border', variable: '--border-error', value: '#F24346', description: 'Error border color (red-500)' },
    { token: 'Error Text', variable: '--fg-error', value: '#DF2125', description: 'Error helper text color (red-600)' },
    { token: 'Disabled BG', variable: '--neutral-50', value: '#F3F3FE', description: 'Disabled background color (neutral-50)' },
    { token: 'Helper Text', variable: '--fg-disabled', value: '#979DC6', description: 'Helper text color (neutral-300)' },
  ],

  usage: `import { InputField } from '@/components/InputField';

// Default input field
<InputField
  label="Email"
  placeholder="Enter your email..."
/>

// Filled state with value
<InputField
  label="Name"
  value="John Doe"
  state="filled"
/>

// Focused state
<InputField
  label="Username"
  placeholder="Enter username..."
  state="focused"
/>

// Error state with helper text
<InputField
  label="Password"
  placeholder="Enter password..."
  state="error"
  helperText="Password is required"
/>

// Disabled state
<InputField
  label="Read Only"
  value="Cannot edit"
  state="disabled"
/>

// Small size
<InputField
  label="Compact"
  placeholder="Small input..."
  size="sm"
/>`,

  propDocs: [
    {
      name: 'label',
      type: 'string',
      default: '"Label"',
      description:
        'The label text displayed above the input field. Rendered with `Label/Small/Medium` typography (12px, medium weight). Uses `--fg-secondary` color.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: '"Placeholder..."',
      description:
        'Placeholder text shown when the input has no value. Displayed in `--fg-disabled` color.',
    },
    {
      name: 'value',
      type: 'string',
      default: '""',
      description:
        'The current value of the input field. When provided, replaces the placeholder text and renders in `--fg-primary` color.',
    },
    {
      name: 'helperText',
      type: 'string',
      default: '""',
      description:
        'Helper or error message displayed below the input field. Uses `--fg-disabled` by default, switches to `--fg-error` in error state. Rendered with `Paragraph/Small` typography (14px).',
    },
    {
      name: 'state',
      type: '"default" | "focused" | "filled" | "error" | "disabled"',
      default: '"default"',
      description:
        'Controls the visual state of the input. **focused** adds a brand-colored border and focus ring. **filled** shows the input with a value. **error** shows a red border and error-colored helper text. **disabled** reduces opacity and prevents interaction.',
    },
    {
      name: 'size',
      type: '"sm" | "md"',
      default: '"md"',
      description:
        'Controls the height of the input box. **sm** renders at 40px height. **md** renders at 44px height.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, states: StateValues): React.ReactNode {
    let state: 'default' | 'focused' | 'filled' | 'error' | 'disabled' = 'default';
    if (states['Disabled']) state = 'disabled';
    else if (states['Error']) state = 'error';
    else if (states['Focused']) state = 'focused';
    else if ((props['Value'] as string)?.length > 0) state = 'filled';

    const size = variants['Size'] === 'Small' ? 'sm' : 'md';

    return (
      <InputField
        label={props['Label'] as string}
        placeholder={props['Placeholder'] as string}
        value={props['Value'] as string}
        helperText={props['Helper Text'] as string}
        state={state}
        size={size}
      />
    );
  },
});
