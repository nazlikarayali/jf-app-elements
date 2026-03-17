import { ComponentRegistry } from '../../types/registry';
import { Button } from './Button';
import type { ButtonVariant, ButtonCorner, ButtonState, ButtonSize } from './Button';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import buttonScss from './Button.scss?raw';

ComponentRegistry.register({
  id: 'button',
  name: 'Button',
  category: 'Actions',
  icon: 'MousePointerClick',

  variants: {
    Type: {
      options: ['Standard', 'Icon Only'],
      default: 'Standard',
    },
    Variant: {
      options: ['Default', 'Secondary', 'Outlined'],
      default: 'Default',
      showWhen: { Type: 'Standard' },
    },
    Corner: {
      options: ['Default', 'Rounded'],
      default: 'Default',
    },
    Size: {
      options: ['Default', 'Small'],
      default: 'Default',
      showWhen: { Type: 'Standard' },
    },
    Filled: {
      options: ['Yes', 'No'],
      default: 'Yes',
      showWhen: { Type: 'Icon Only' },
    },
  },

  properties: [
    { name: 'Label', type: 'text', default: 'Button', showWhen: { Type: 'Standard' } },
    { name: 'Left Icon', type: 'icon', default: 'Plus', showWhen: { Type: 'Standard' } },
    { name: 'Right Icon', type: 'icon', default: 'Plus', showWhen: { Type: 'Standard' } },
    { name: 'Icon', type: 'icon', default: 'Plus', showWhen: { Type: 'Icon Only' } },
    { name: 'Shrinked', type: 'boolean', default: false, showWhen: { Type: 'Standard' } },
    { name: 'Full Width', type: 'boolean', default: false, showWhen: { Type: 'Standard' } },
  ],

  states: [
    { name: 'Hovered', default: false },
    { name: 'Disabled', default: false },
  ],

  scss: buttonScss,

  colorTokens: [
    // Default variant
    { token: 'Background', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Fill color (primary-600)', variants: { Type: 'Standard', Variant: 'Default' } },
    { token: 'Hover', variable: '--bg-fill-brand-hover', value: '#6D29D8', description: 'Hover fill (primary-700)', variants: { Type: 'Standard', Variant: 'Default' } },
    { token: 'Disabled', variable: '--bg-fill-brand-disabled', value: '#DBD6FA', description: 'Disabled fill (primary-200)', variants: { Type: 'Standard', Variant: 'Default' } },
    { token: 'Text', variable: '--fg-inverse', value: '#FFFFFF', description: 'Label color', variants: { Type: 'Standard', Variant: 'Default' } },
    // Secondary variant
    { token: 'Background', variable: '--bg-fill-secondary', value: '#DADEF3', description: 'Fill color (neutral-100)', variants: { Type: 'Standard', Variant: 'Secondary' } },
    { token: 'Hover', variable: '--bg-fill-secondary-hover', value: '#C8CEED', description: 'Hover fill (neutral-200)', variants: { Type: 'Standard', Variant: 'Secondary' } },
    { token: 'Disabled', variable: '--neutral-50', value: '#F3F3FE', description: 'Disabled fill (neutral-50)', variants: { Type: 'Standard', Variant: 'Secondary' } },
    { token: 'Text', variable: '--fg-primary', value: '#091141', description: 'Label color (neutral-900)', variants: { Type: 'Standard', Variant: 'Secondary' } },
    { token: 'Disabled Text', variable: '--fg-disabled', value: '#979DC6', description: 'Disabled label (neutral-300)', variants: { Type: 'Standard', Variant: 'Secondary' } },
    // Outlined variant
    { token: 'Border', variable: '--border', value: '#DADEF3', description: 'Border color (neutral-100)', variants: { Type: 'Standard', Variant: 'Outlined' } },
    { token: 'Hover Border', variable: '--border-hover', value: '#C8CEED', description: 'Hover border (neutral-200)', variants: { Type: 'Standard', Variant: 'Outlined' } },
    { token: 'Hover BG', variable: '--bg-fill-hover', value: '#F3F3FE', description: 'Hover fill (neutral-50)', variants: { Type: 'Standard', Variant: 'Outlined' } },
    { token: 'Text', variable: '--fg-primary', value: '#091141', description: 'Label color (neutral-900)', variants: { Type: 'Standard', Variant: 'Outlined' } },
    { token: 'Disabled Border', variable: '--border-disabled', value: '#F3F3FE', description: 'Disabled border (neutral-50)', variants: { Type: 'Standard', Variant: 'Outlined' } },
    { token: 'Disabled Text', variable: '--fg-disabled', value: '#979DC6', description: 'Disabled label (neutral-300)', variants: { Type: 'Standard', Variant: 'Outlined' } },
    // Icon Only - Filled
    { token: 'Background', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Icon button bg (primary-600)', variants: { Type: 'Icon Only', Filled: 'Yes' } },
    { token: 'Hover', variable: '--bg-fill-brand-hover', value: '#6D29D8', description: 'Hover bg (primary-700)', variants: { Type: 'Icon Only', Filled: 'Yes' } },
    { token: 'Disabled', variable: '--bg-fill-brand-disabled', value: '#DBD6FA', description: 'Disabled bg (primary-200)', variants: { Type: 'Icon Only', Filled: 'Yes' } },
    { token: 'Icon Color', variable: '--fg-inverse', value: '#FFFFFF', description: 'Icon color (white)', variants: { Type: 'Icon Only', Filled: 'Yes' } },
    // Icon Only - Ghost (no bg)
    { token: 'Icon Color', variable: '--fg-brand', value: '#7D38EF', description: 'Icon color (primary-600)', variants: { Type: 'Icon Only', Filled: 'No' } },
    { token: 'Hover BG', variable: '--bg-surface-brand-hover', value: '#DBD6FA', description: 'Hover bg (primary-200)', variants: { Type: 'Icon Only', Filled: 'No' } },
    { token: 'Disabled', variable: '--fg-disabled', value: '#979DC6', description: 'Disabled icon color (neutral-300)', variants: { Type: 'Icon Only', Filled: 'No' } },
  ],

  usage: `import { Button } from '@/components/Button';

// Primary button with plus icons
<Button
  variant="Default"
  label="Save Changes"
  leftIcon="Plus"
  rightIcon="Plus"
/>

// Secondary button with custom icons
<Button
  variant="Secondary"
  label="Download"
  leftIcon="Download"
  rightIcon="none"
/>

// Outlined button with arrow icons, rounded corners
<Button
  variant="Outlined"
  corner="Rounded"
  label="Next Step"
  leftIcon="none"
  rightIcon="ArrowRight"
/>

// Button with different left and right icons
<Button
  variant="Default"
  label="Send Message"
  leftIcon="Mail"
  rightIcon="Send"
/>

// Disabled state
<Button
  variant="Default"
  label="Submit"
  state="Disabled"
  leftIcon="Check"
  rightIcon="none"
/>

// Full width button without icons
<Button
  variant="Default"
  label="Continue"
  fullWidth={true}
  leftIcon="none"
  rightIcon="none"
/>`,

  propDocs: [
    {
      name: 'variant',
      type: '"Default" | "Secondary" | "Outlined"',
      default: '"Default"',
      description:
        'Controls the visual style of the button. **Default** uses the brand fill color (`bg-fill-brand`). **Secondary** uses a neutral fill (`bg-fill-secondary`). **Outlined** renders a transparent button with a border (`border`).',
    },
    {
      name: 'corner',
      type: '"Default" | "Rounded"',
      default: '"Default"',
      description:
        'Sets the border-radius style. **Default** uses `radius-lg` (12px). **Rounded** uses `radius-rounded` (9999px) for a pill-shaped button.',
    },
    {
      name: 'state',
      type: '"Default" | "Hovered" | "Disabled"',
      default: '"Default"',
      description:
        'Controls the interactive state. **Hovered** applies the hover visual style programmatically. **Disabled** reduces opacity, changes background to the disabled token, and prevents interaction.',
    },
    {
      name: 'label',
      type: 'string',
      default: '"Button"',
      description:
        'The text label displayed inside the button. Rendered with `Label/Large/Medium` typography (16px, medium weight). Truncated with ellipsis on overflow.',
    },
    {
      name: 'leftIcon',
      type: 'string',
      default: '"Plus"',
      description:
        'Name of the Lucide icon to render on the left side of the label. Pass `"none"` to hide the icon. Accepts any valid Lucide icon name (e.g. `"ArrowRight"`, `"Download"`, `"Mail"`).',
    },
    {
      name: 'rightIcon',
      type: 'string',
      default: '"Plus"',
      description:
        'Name of the Lucide icon to render on the right side of the label. Pass `"none"` to hide the icon. Accepts any valid Lucide icon name.',
    },
    {
      name: 'shrinked',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, removes the `min-width: 160px` constraint, allowing the button to shrink to its content width.',
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, the button expands to fill the full width of its parent container.',
    },
    {
      name: 'onClick',
      type: '() => void',
      default: 'undefined',
      description:
        'Callback function fired when the button is clicked. Not called when the button is disabled.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, states: StateValues): React.ReactNode {
    let state: ButtonState = 'Default';
    if (states['Disabled']) state = 'Disabled';
    else if (states['Hovered']) state = 'Hovered';

    const isIconOnly = variants['Type'] === 'Icon Only';

    return (
      <Button
        variant={variants['Variant'] as ButtonVariant}
        corner={variants['Corner'] as ButtonCorner}
        size={variants['Size'] as ButtonSize}
        state={state}
        label={props['Label'] as string}
        leftIcon={props['Left Icon'] as string}
        rightIcon={props['Right Icon'] as string}
        iconOnly={isIconOnly}
        iconOnlyIcon={props['Icon'] as string}
        iconOnlyFilled={variants['Filled'] === 'Yes'}
        shrinked={props['Shrinked'] as boolean}
        fullWidth={props['Full Width'] as boolean}
      />
    );
  },
});
