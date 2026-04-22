import { ComponentRegistry } from '../../types/registry';
import { TabBar } from './TabBar';
import type { TabBarState } from './TabBar';
import type { VariantValues, PropertyValues, StateValues } from '../../types/component';
import scss from './TabBar.scss?raw';

ComponentRegistry.register({
  id: 'tab-bar',
  name: 'Tab Bar',
  category: 'Widget Components',
  icon: 'PanelTop',

  variants: {
    'Tab Count': {
      options: ['2 Tabs', '3 Tabs', '4 Tabs'],
      default: '3 Tabs',
    },
  },

  properties: [
    { name: 'Tab 1', type: 'text', default: 'Overview' },
    { name: 'Tab 2', type: 'text', default: 'Health' },
    { name: 'Tab 3', type: 'text', default: 'Forms', showWhen: { 'Tab Count': '3 Tabs' } },
    { name: 'Tab 4', type: 'text', default: 'Settings', showWhen: { 'Tab Count': '4 Tabs' } },
    { name: 'Active Tab', type: 'select', default: '1', options: ['1', '2', '3', '4'] },
  ],

  states: [
    { name: 'Disabled', default: false },
  ],

  scss,

  colorTokens: [
    { token: 'Container', variable: '--bg-fill-active', value: '#DADEF3', description: 'Tab bar background (neutral-100)' },
    { token: 'Active Tab', variable: '--bg-surface', value: '#FFFFFF', description: 'Active tab background' },
    { token: 'Active Text', variable: '--fg-primary', value: '#091141', description: 'Active tab text color' },
    { token: 'Inactive Text', variable: '--fg-secondary', value: '#353C6A', description: 'Inactive tab text color' },
    { token: 'Shadow', variable: '--shadow-sm', value: '0 1px 2px rgba(0,0,0,0.1)', description: 'Active tab shadow' },
  ],

  usage: `import { TabBar } from '@/components/TabBar';

// 3 tabs
<TabBar tabs={['Overview', 'Health', 'Forms']} activeIndex={0} onChange={(i) => setTab(i)} />

// 2 tabs
<TabBar tabs={['Details', 'Settings']} activeIndex={1} />

// Disabled
<TabBar tabs={['Tab 1', 'Tab 2']} state="disabled" />`,

  propDocs: [
    { name: 'tabs', type: 'string[]', default: '["Tab 1", "Tab 2", "Tab 3"]', description: 'Array of tab labels.' },
    { name: 'activeIndex', type: 'number', default: '0', description: 'Index of the active tab.' },
    { name: 'state', type: '"default" | "disabled"', default: '"default"', description: 'Controls interactivity.' },
    { name: 'onChange', type: '(index: number) => void', default: 'undefined', description: 'Callback when a tab is clicked.' },
  ],

  render(variants: VariantValues, props: PropertyValues, states: StateValues): React.ReactNode {
    const tabCount = variants['Tab Count'] === '2 Tabs' ? 2 : variants['Tab Count'] === '4 Tabs' ? 4 : 3;
    const tabLabels = [
      props['Tab 1'] as string,
      props['Tab 2'] as string,
      props['Tab 3'] as string,
      props['Tab 4'] as string,
    ].slice(0, tabCount);

    const activeIndex = Math.max(0, parseInt(props['Active Tab'] as string, 10) - 1);
    const state: TabBarState = states['Disabled'] ? 'disabled' : 'default';

    return (
      <TabBar
        tabs={tabLabels}
        activeIndex={activeIndex}
        state={state}
      />
    );
  },
});
