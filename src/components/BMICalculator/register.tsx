import { ComponentRegistry } from '../../types/registry';
import { BMICalculator } from './BMICalculator';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './BMICalculator.scss?raw';

ComponentRegistry.register({
  id: 'bmi-calculator',
  name: 'BMI Calculator',
  category: 'Widgets',
  icon: 'Activity',

  variants: {},

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
  ],

  states: [],

  scss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: 'Widget background' },
    { token: 'Title', variable: '--fg-primary', value: '#091141', description: 'Title text' },
    { token: 'Subtitle', variable: '--fg-disabled', value: '#979DC6', description: 'Subtitle text' },
    { token: 'Icon Background', variable: '--bg-surface-brand', value: '#EDE8FD', description: 'Icon container background' },
    { token: 'Icon Color', variable: '--fg-brand', value: '#7D38EF', description: 'Icon color' },
    { token: 'Input Border', variable: '--neutral-200', value: '#DADEF3', description: 'Input border' },
    { token: 'Result Background', variable: '--bg-surface', value: '#F8F9FF', description: 'Result card background' },
    { token: 'Normal BMI', variable: '', value: '#22C55E', description: 'Normal weight indicator' },
    { token: 'Overweight BMI', variable: '', value: '#F59E0B', description: 'Overweight indicator' },
    { token: 'Obese BMI', variable: '', value: '#EF4444', description: 'Obese indicator' },
    { token: 'Underweight BMI', variable: '', value: '#3B82F6', description: 'Underweight indicator' },
  ],

  usage: `import { BMICalculator } from '@/components/BMICalculator';

// Default
<BMICalculator />

// Selected state
<BMICalculator selected />`,

  propDocs: [
    {
      name: 'selected',
      type: 'boolean',
      default: 'false',
      description: 'When true, shows a blue selection outline around the widget.',
    },
  ],

  render(_variants: VariantValues, props: PropertyValues, _states: StateValues) {
    return (
      <BMICalculator
        selected={props['Selected'] as boolean}
      />
    );
  },
});
