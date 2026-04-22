import { ComponentRegistry } from '../../types/registry';
import { Tag } from './Tag';
import type { TagVariant, TagSize, TagState } from './Tag';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './Tag.scss?raw';

ComponentRegistry.register({
  id: 'tag',
  name: 'Tag',
  category: 'Widget Components',
  icon: 'Tag',

  variants: {
    Variant: {
      options: ['Default', 'Brand', 'Success', 'Warning', 'Error', 'Info'],
      default: 'Default',
    },
    Size: {
      options: ['Small', 'Medium'],
      default: 'Medium',
    },
  },

  properties: [
    { name: 'Label', type: 'text', default: 'Tag' },
    { name: 'Removable', type: 'boolean', default: false },
  ],

  states: [
    { name: 'Hovered', default: false },
    { name: 'Disabled', default: false },
  ],

  scss,

  colorTokens: [
    // Default variant
    { token: 'Background', variable: '--bg-fill-active', value: '#DADEF3', description: 'Default background (neutral-100)', variants: { Variant: 'Default' } },
    { token: 'Text', variable: '--fg-secondary', value: '#353C6A', description: 'Default text color (neutral-700)', variants: { Variant: 'Default' } },
    // Brand variant
    { token: 'Background', variable: '--bg-surface-brand', value: '#EDE8FE', description: 'Brand background (primary-50)', variants: { Variant: 'Brand' } },
    { token: 'Text', variable: '--fg-brand', value: '#7D38EF', description: 'Brand text color (primary-600)', variants: { Variant: 'Brand' } },
    // Success variant
    { token: 'Background', variable: '--bg-surface-success', value: '#E6F7EC', description: 'Success background (green-50)', variants: { Variant: 'Success' } },
    { token: 'Text', variable: '--fg-success', value: '#19A44B', description: 'Success text color (green-600)', variants: { Variant: 'Success' } },
    // Warning variant
    { token: 'Background', variable: '--bg-surface-warning', value: '#FEF3E5', description: 'Warning background (orange-50)', variants: { Variant: 'Warning' } },
    { token: 'Text', variable: '--fg-warning', value: '#DC7801', description: 'Warning text color (orange-600)', variants: { Variant: 'Warning' } },
    // Error variant
    { token: 'Background', variable: '--bg-surface-error', value: '#FCEAEA', description: 'Error background (red-50)', variants: { Variant: 'Error' } },
    { token: 'Text', variable: '--fg-error', value: '#DF2125', description: 'Error text color (red-600)', variants: { Variant: 'Error' } },
    // Info variant
    { token: 'Background', variable: '--bg-surface-info', value: '#E5F2FA', description: 'Info background (blue-50)', variants: { Variant: 'Info' } },
    { token: 'Text', variable: '--fg-info', value: '#0385C8', description: 'Info text color (blue-600)', variants: { Variant: 'Info' } },
  ],

  usage: `import { Tag } from '@/components/Tag';

// Default tag
<Tag label="Default" />

// Brand tag
<Tag label="Brand" variant="brand" />

// Success tag, small size
<Tag label="Active" variant="success" size="sm" />

// Removable tag
<Tag label="Remove me" variant="brand" removable onRemove={() => {}} />

// Warning tag, disabled
<Tag label="Pending" variant="warning" state="disabled" />

// Error tag with remove
<Tag label="Failed" variant="error" removable size="sm" />

// Info tag
<Tag label="Info" variant="info" size="md" />`,

  propDocs: [
    {
      name: 'label',
      type: 'string',
      default: '"Tag"',
      description:
        'The text content displayed inside the tag.',
    },
    {
      name: 'variant',
      type: '"default" | "brand" | "success" | "warning" | "error" | "info"',
      default: '"default"',
      description:
        'Controls the color scheme of the tag. Each variant maps to its corresponding semantic color tokens for background and text.',
    },
    {
      name: 'size',
      type: '"sm" | "md"',
      default: '"md"',
      description:
        'Controls the size of the tag. **sm** uses 10px font with 2px/8px padding. **md** uses 12px font with 4px/10px padding.',
    },
    {
      name: 'removable',
      type: 'boolean',
      default: 'false',
      description:
        'When `true`, renders an X close icon button inside the tag that triggers `onRemove` when clicked.',
    },
    {
      name: 'state',
      type: '"default" | "hover" | "disabled"',
      default: '"default"',
      description:
        'Controls the interactive state. **hover** applies a darker background. **disabled** reduces opacity to 0.5 and disables pointer events.',
    },
    {
      name: 'onRemove',
      type: '() => void',
      default: 'undefined',
      description:
        'Callback function fired when the remove button is clicked. Only relevant when `removable` is `true`.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, states: StateValues): React.ReactNode {
    let state: TagState = 'default';
    if (states['Disabled']) state = 'disabled';
    else if (states['Hovered']) state = 'hover';

    const sizeMap: Record<string, TagSize> = {
      Small: 'sm',
      Medium: 'md',
    };

    const variantMap: Record<string, TagVariant> = {
      Default: 'default',
      Brand: 'brand',
      Success: 'success',
      Warning: 'warning',
      Error: 'error',
      Info: 'info',
    };

    return (
      <Tag
        label={props['Label'] as string}
        variant={variantMap[variants['Variant']] || 'default'}
        size={sizeMap[variants['Size']] || 'md'}
        removable={props['Removable'] as boolean}
        state={state}
      />
    );
  },
});
