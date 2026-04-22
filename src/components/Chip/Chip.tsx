import { useState, useEffect } from 'react';
import type React from 'react';
import './Chip.scss';

// ============================================
// Types
// ============================================
export type ChipState = 'default' | 'hover' | 'active' | 'disabled';

export interface ChipProps {
  label?: string;
  state?: ChipState;
  onChange?: (active: boolean) => void;
}

// ============================================
// Chip Component
// ============================================
export const Chip: React.FC<ChipProps> = ({
  label = 'Chip',
  state = 'default',
  onChange,
}) => {
  const [internalActive, setInternalActive] = useState(state === 'active');
  const isDisabled = state === 'disabled';

  useEffect(() => {
    setInternalActive(state === 'active');
  }, [state]);

  const handleClick = () => {
    if (!isDisabled) {
      const next = !internalActive;
      setInternalActive(next);
      onChange?.(next);
    }
  };

  const classes = [
    'jf-chip',
    internalActive && 'jf-chip--active',
    state === 'hover' && 'jf-chip--hover',
    isDisabled && 'jf-chip--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} type="button" disabled={isDisabled} onClick={handleClick}>
      {label}
    </button>
  );
};

export default Chip;
