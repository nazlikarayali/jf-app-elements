import { ComponentRegistry } from '../../types/registry';
import { MemoriesGallery } from './MemoriesGallery';
import type { MemoriesColumns } from './MemoriesGallery';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './MemoriesGallery.scss?raw';

ComponentRegistry.register({
  id: 'memories-gallery',
  name: 'Memories Gallery',
  category: 'Widgets',
  icon: 'Images',

  variants: {
    Columns: {
      options: ['2', '3', '4'],
      default: '3',
    },
  },

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Shrinked', type: 'boolean', default: false },
  ],

  states: [],

  scss,

  colorTokens: [
    { token: 'Card background', variable: '--bg-surface', value: '#FFFFFF', description: 'Card & widget surface' },
    { token: 'Card border', variable: '--border-secondary', value: '#C8CEED', description: 'Card outline' },
    { token: 'Label', variable: '--fg-secondary', value: '#353C6A', description: 'Filter field labels' },
    { token: 'Title', variable: '--fg-primary', value: '#091141', description: 'Memory card title' },
    { token: 'Description', variable: '--fg-disabled', value: '#979DC6', description: 'Muted description/placeholder text' },
    { token: 'Badge bg (empty)', variable: '--bg-surface-warning', value: '#FEF3E5', description: 'Warning badge background (missing session)' },
    { token: 'Badge text (empty)', variable: '--fg-warning', value: '#DC7801', description: 'Warning badge text' },
    { token: 'Focus ring', variable: '--fg-brand', value: '#7D38EF', description: 'Input focus ring color' },
  ],

  usage: `import { MemoriesGallery } from '@/components/MemoriesGallery';

// Default 3-column grid
<MemoriesGallery />

// 2-column (compact spaces)
<MemoriesGallery columns="2" />

// 4-column (wide dashboards)
<MemoriesGallery columns="4" />`,

  propDocs: [
    {
      name: 'columns',
      type: '"2" | "3" | "4"',
      default: '"3"',
      description: 'Number of memory cards per row.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description: 'When `true`, applies a 2px `border-info` outline around the widget.',
    },
    {
      name: 'shrinked',
      type: 'boolean',
      default: 'false',
      description: 'When `true`, constrains max-width to 480px for compact layouts.',
    },
  ],

  render(variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    return (
      <MemoriesGallery
        columns={variants['Columns'] as MemoriesColumns}
        selected={props['Selected'] as boolean}
        shrinked={props['Shrinked'] as boolean}
      />
    );
  },
});
