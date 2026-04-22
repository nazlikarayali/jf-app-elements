import { ComponentRegistry } from '../../types/registry';
import { FormSubmissions } from './FormSubmissions';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './FormSubmissions.scss?raw';

ComponentRegistry.register({
  id: 'form-submissions',
  name: 'Form Submissions',
  category: 'Widgets',
  icon: 'FileText',
  variants: {},
  properties: [{ name: 'Selected', type: 'boolean', default: false }],
  states: [],
  scss,
  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: 'Widget background' },
    { token: 'Border', variable: '--border', value: '#DADEF3', description: 'Default border color' },
    { token: 'Completed', variable: '--bg-surface-success', value: '#DDFBE8', description: 'Completed status badge bg' },
    { token: 'Pending', variable: '--bg-surface-warning', value: '#FEF3C5', description: 'Pending status badge bg' },
    { token: 'Rejected', variable: '--bg-surface-error', value: '#FEE2E2', description: 'Rejected status badge bg' },
    { token: 'Active Chip', variable: '--bg-fill-brand', value: '#7D38EF', description: 'Active filter chip bg' },
    { token: 'Header Row', variable: '--bg-fill-active', value: '#F5F5F5', description: 'Table header bg' },
    { token: 'Row Hover', variable: '--bg-fill-hover', value: '#FAFAFA', description: 'Table row hover bg' },
  ],
  usage: `<FormSubmissions />\n<FormSubmissions selected />`,
  propDocs: [{ name: 'selected', type: 'boolean', default: 'false', description: 'Selection outline.' }],
  render(_v: VariantValues, p: PropertyValues, _s: StateValues) {
    return <FormSubmissions selected={p['Selected'] as boolean} />;
  },
});
