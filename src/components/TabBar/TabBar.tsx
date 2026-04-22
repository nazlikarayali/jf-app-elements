import { useState, useEffect } from 'react';
import type React from 'react';
import './TabBar.scss';

// ============================================
// Types
// ============================================
export type TabBarState = 'default' | 'disabled';

export interface TabBarProps {
  tabs?: string[];
  activeIndex?: number;
  state?: TabBarState;
  onChange?: (index: number) => void;
}

// ============================================
// TabBar Component
// ============================================
export const TabBar: React.FC<TabBarProps> = ({
  tabs = ['Tab 1', 'Tab 2', 'Tab 3'],
  activeIndex = 0,
  state = 'default',
  onChange,
}) => {
  const [active, setActive] = useState(activeIndex);
  const isDisabled = state === 'disabled';

  useEffect(() => {
    setActive(activeIndex);
  }, [activeIndex]);

  const handleClick = (index: number) => {
    if (!isDisabled) {
      setActive(index);
      onChange?.(index);
    }
  };

  const classes = [
    'jf-tab-bar',
    isDisabled && 'jf-tab-bar--disabled',
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {tabs.map((tab, i) => (
        <button
          key={i}
          className={`jf-tab-bar__tab ${active === i ? 'jf-tab-bar__tab--active' : ''}`}
          onClick={() => handleClick(i)}
          disabled={isDisabled}
          type="button"
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
