import { ComponentRegistry } from '../../types/registry';
import { Testimonial } from './Testimonial';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import testimonialScss from './Testimonial.scss?raw';

ComponentRegistry.register({
  id: 'testimonial',
  name: 'Testimonial',
  category: 'Data Display',
  icon: 'Quote',

  variants: {},

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
    { name: 'Shrinked', type: 'boolean', default: false },
  ],

  states: [],

  scss: testimonialScss,

  colorTokens: [
    { token: 'Background', variable: '--bg-surface', value: '#FFFFFF', description: 'Card background' },
    { token: 'Avatar BG', variable: '--bg-surface-brand', value: '#EDE8FE', description: 'Avatar background (primary-100)' },
    { token: 'Avatar Icon', variable: '--fg-brand', value: '#7D38EF', description: 'Avatar icon color (primary-600)' },
    { token: 'Name', variable: '--fg-primary', value: '#091141', description: 'Testimonial name (neutral-900)' },
    { token: 'Quote', variable: '--fg-primary', value: '#091141', description: 'Quote text (neutral-900)' },
    { token: 'Nav BG', variable: '--bg-surface-active', value: '#DADEF3', description: 'Navigation buttons (neutral-100)' },
    { token: 'Selected', variable: '--border-info', value: '#00A3E9', description: 'Selected border (Sky-500)' },
  ],

  usage: `import { Testimonial } from '@/components/Testimonial';

// Default testimonial carousel
<Testimonial />

// Custom testimonials
<Testimonial
  items={[
    { name: "Jane Doe", text: "\u201CAbsolutely amazing product!\u201D" },
    { name: "John Smith", text: "\u201CChanged how we work.\u201D" },
    { name: "Sarah Lee", text: "\u201CHighly recommended.\u201D" },
  ]}
/>

// Shrinked (vertical layout)
<Testimonial shrinked />`,

  propDocs: [
    {
      name: 'items',
      type: 'TestimonialItem[]',
      default: '[3 default items]',
      description:
        'Array of testimonials. Each has `name` (H6/Bold, 20px) and `text` (Paragraph/XSmall, 12px). Navigated with chevron buttons.',
    },
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description: 'When `true`, applies a 2px `border-info` border.',
    },
    {
      name: 'shrinked',
      type: 'boolean',
      default: 'false',
      description: 'When `true`, constrains to 300px with vertical/centered layout.',
    },
  ],

  render(_variants: VariantValues, props: PropertyValues, _states: StateValues): React.ReactNode {
    return (
      <Testimonial
        selected={props['Selected'] as boolean}
        shrinked={props['Shrinked'] as boolean}
      />
    );
  },
});
