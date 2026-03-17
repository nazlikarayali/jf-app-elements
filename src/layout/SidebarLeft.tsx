import { useState } from 'react';
import { icons } from 'lucide-react';
import type { RegisteredComponent } from '../types/registry';

interface SidebarLeftProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  components: RegisteredComponent[];
}

function ComponentIcon({ name }: { name: string }) {
  const Icon = icons[name as keyof typeof icons];
  if (!Icon) return <span>{name}</span>;
  return <Icon size={16} />;
}

export function SidebarLeft({ selectedId, onSelect, components }: SidebarLeftProps) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? components.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.category.toLowerCase().includes(search.toLowerCase())
      )
    : components;

  const categories: Record<string, typeof filtered> = {};
  for (const comp of filtered) {
    const cat = comp.category || 'General';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(comp);
  }

  return (
    <aside className="sidebar-left">
      <div className="sidebar-left__header">
        <h3>Components</h3>
        <span className="component-count">{components.length}</span>
      </div>
      <div className="sidebar-left__search">
        <input
          type="text"
          placeholder="Search components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <nav className="component-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>{search ? 'No matching components.' : 'No components yet.'}</p>
            <p className="empty-state__hint">
              Components will appear here as they are added from Figma designs.
            </p>
          </div>
        ) : (
          Object.entries(categories).map(([category, comps]) => (
            <div className="component-list__category" key={category}>
              <div className="component-list__category-title">{category}</div>
              {comps.map((comp) => (
                <button
                  key={comp.id}
                  className={`component-list__item${comp.id === selectedId ? ' active' : ''}`}
                  onClick={() => onSelect(comp.id)}
                >
                  <span className="component-list__item-icon">
                    <ComponentIcon name={comp.icon} />
                  </span>
                  {comp.name}
                </button>
              ))}
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}
