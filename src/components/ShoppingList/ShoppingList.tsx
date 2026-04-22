import { useState, useCallback } from 'react';
import './ShoppingList.scss';

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

export interface ShoppingListProps {
  selected?: boolean;
}

const CATEGORIES = ['Produce', 'Dairy', 'Bakery', 'Meat', 'Frozen', 'Other'];

const CATEGORY_EMOJI: Record<string, string> = {
  Produce: '🥦',
  Dairy: '🥛',
  Bakery: '🍞',
  Meat: '🥩',
  Frozen: '🧊',
  Other: '🛒',
};

const DEFAULT_ITEMS: ShoppingItem[] = [
  { id: '1', name: 'Apples', category: 'Produce', checked: false },
  { id: '2', name: 'Milk', category: 'Dairy', checked: false },
  { id: '3', name: 'Sourdough bread', category: 'Bakery', checked: true },
  { id: '4', name: 'Chicken breast', category: 'Meat', checked: false },
];


export function ShoppingList({ selected = false }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingItem[]>(DEFAULT_ITEMS);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Other');

  const checkedCount = items.filter(i => i.checked).length;

  const toggleItem = useCallback((id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const addItem = useCallback(() => {
    const name = newName.trim();
    if (!name) return;
    setItems(prev => [...prev, { id: Date.now().toString(), name, category: newCategory, checked: false }]);
    setNewName('');
  }, [newName, newCategory]);


  const classes = [
    'jf-shopping',
    selected && 'jf-shopping--selected',
  ].filter(Boolean).join(' ');

  const grouped = CATEGORIES.reduce<Record<string, ShoppingItem[]>>((acc, cat) => {
    const catItems = items.filter(i => i.category === cat);
    if (catItems.length) acc[cat] = catItems;
    return acc;
  }, {});

  return (
    <div className={classes}>
      {/* Header */}
      <div className="jf-shopping__header">
        <div className="jf-shopping__icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <div className="jf-shopping__header-text">
          <h3 className="jf-shopping__title">Shopping List</h3>
          <p className="jf-shopping__subtitle">
            {checkedCount} of {items.length} items checked
          </p>
        </div>
        {items.length > 0 && (
          <div className="jf-shopping__badge">{items.length - checkedCount} left</div>
        )}
      </div>

      {/* Progress */}
      <div className="jf-shopping__progress-track">
        <div
          className="jf-shopping__progress-fill"
          style={{ width: items.length ? `${(checkedCount / items.length) * 100}%` : '0%' }}
        />
      </div>

      {/* Item list grouped by category */}
      <div className="jf-shopping__list">
        {Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat} className="jf-shopping__group">
            <p className="jf-shopping__group-label">
              <span className="jf-shopping__group-emoji">{CATEGORY_EMOJI[cat]}</span>
              {cat}
            </p>
            {catItems.map(item => (
              <div key={item.id} className={`jf-shopping__item${item.checked ? ' checked' : ''}`}>
                <button
                  className="jf-shopping__checkbox"
                  onClick={() => toggleItem(item.id)}
                  aria-label={item.checked ? 'Uncheck item' : 'Check item'}
                >
                  {item.checked && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </button>
                <span className="jf-shopping__item-name">{item.name}</span>
                <button className="jf-shopping__remove" onClick={() => removeItem(item.id)} aria-label="Remove item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Add item */}
      <div className="jf-shopping__add-section">
        {/* Category chips */}
        <div className="jf-shopping__category-label">Select a category</div>
        <div className="jf-shopping__chips">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`jf-shopping__chip${newCategory === cat ? ' active' : ''}`}
              onClick={() => setNewCategory(cat)}
            >
              <span>{CATEGORY_EMOJI[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="jf-shopping__add">
          <input
            className="jf-shopping__input"
            type="text"
            placeholder={`Add a ${newCategory.toLowerCase()} item...`}
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addItem(); }}
          />
          <button
            className="jf-shopping__add-btn"
            onClick={addItem}
            disabled={!newName.trim()}
            aria-label="Add item"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}

export default ShoppingList;
