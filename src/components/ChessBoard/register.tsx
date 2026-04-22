import { ComponentRegistry } from '../../types/registry';
import { ChessBoard } from './ChessBoard';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './ChessBoard.scss?raw';

ComponentRegistry.register({
  id: 'chess-board',
  name: 'Chess Board',
  category: 'Widgets',
  icon: 'Crown',

  variants: {},

  properties: [
    { name: 'Selected', type: 'boolean', default: false },
  ],

  states: [],

  scss,

  colorTokens: [
    { token: 'Background', variable: '--bg-fill', value: '#FFFFFF', description: 'Widget background' },
    { token: 'Light Square', variable: '--bg-surface', value: '#FFFFFF', description: 'Light board squares' },
    { token: 'Dark Square', variable: '--bg-fill-active', value: '#DADEF3', description: 'Dark board squares' },
    { token: 'Selected Square', variable: '--bg-surface-brand', value: '#EDE8FE', description: 'Selected piece highlight' },
    { token: 'Valid Move', variable: '--fg-brand', value: '#7D38EF', description: 'Valid move dot color' },
    { token: 'Title', variable: '--fg-primary', value: '#091141', description: 'Title text' },
    { token: 'Subtitle', variable: '--fg-disabled', value: '#979DC6', description: 'Turn indicator text' },
    { token: 'Border', variable: '--border', value: '#DADEF3', description: 'Widget border' },
  ],

  usage: `import { ChessBoard } from '@/components/ChessBoard';

<ChessBoard />
<ChessBoard selected />`,

  propDocs: [
    { name: 'selected', type: 'boolean', default: 'false', description: 'Shows selection outline.' },
  ],

  render(_variants: VariantValues, props: PropertyValues, _states: StateValues) {
    return <ChessBoard selected={props['Selected'] as boolean} />;
  },
});
