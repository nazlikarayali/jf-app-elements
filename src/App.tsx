import { useState, useEffect, useCallback } from 'react';
import { Header } from './layout/Header';
import { SidebarLeft } from './layout/SidebarLeft';
import { SidebarRight } from './layout/SidebarRight';
import { MainContent } from './layout/MainContent';
import { ComponentRegistry, type RegisteredComponent } from './types/registry';
import type { VariantValues, PropertyValues, StateValues } from './types/component';
import './styles/app.scss';

// Register components
import './components/Card/register';
import './components/Button/register';
import './components/DonationBox/register';
import './components/ProductList/register';
import './components/Heading/register';
import './components/List/register';
import './components/Document/register';
import './components/SignDocument/register';

function App() {
  const [components, setComponents] = useState<RegisteredComponent[]>(ComponentRegistry.getAll());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [variants, setVariants] = useState<VariantValues>({});
  const [properties, setProperties] = useState<PropertyValues>({});
  const [states, setStates] = useState<StateValues>({});

  useEffect(() => {
    return ComponentRegistry.subscribe(() => {
      setComponents(ComponentRegistry.getAll());
    });
  }, []);

  const selectedComponent = selectedId ? ComponentRegistry.get(selectedId) || null : null;

  const handleSelect = useCallback((id: string) => {
    const comp = ComponentRegistry.get(id);
    if (!comp) return;

    setSelectedId(id);

    const newVariants: VariantValues = {};
    for (const [group, config] of Object.entries(comp.variants)) {
      newVariants[group] = config.default || config.options[0];
    }
    setVariants(newVariants);

    const newProps: PropertyValues = {};
    for (const prop of comp.properties) {
      newProps[prop.name] = prop.default;
    }
    setProperties(newProps);

    const newStates: StateValues = {};
    for (const state of comp.states) {
      newStates[state.name] = state.default || false;
    }
    setStates(newStates);
  }, []);

  const handleVariantChange = useCallback((group: string, value: string) => {
    setVariants((prev) => ({ ...prev, [group]: value }));
  }, []);

  const handlePropertyChange = useCallback((name: string, value: string | boolean | number) => {
    setProperties((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleStateChange = useCallback((name: string, value: boolean) => {
    setStates((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <SidebarLeft
          selectedId={selectedId}
          onSelect={handleSelect}
          components={components}
        />
        <MainContent
          component={selectedComponent}
          variants={variants}
          properties={properties}
          states={states}
        />
        <SidebarRight
          component={selectedComponent}
          variants={variants}
          properties={properties}
          states={states}
          onVariantChange={handleVariantChange}
          onPropertyChange={handlePropertyChange}
          onStateChange={handleStateChange}
        />
      </div>
    </div>
  );
}

export default App;
