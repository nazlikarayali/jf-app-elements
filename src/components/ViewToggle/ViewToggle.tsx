import { useState, useEffect } from 'react';
import type React from 'react';
import './ViewToggle.scss';

// ============================================
// Types
// ============================================
export type ViewToggleValue = 'grid' | 'list';
export type ViewToggleState = 'default' | 'disabled';

export interface ViewToggleProps {
  value?: ViewToggleValue;
  state?: ViewToggleState;
  onChange?: (value: ViewToggleValue) => void;
}

// ============================================
// ViewToggle Component
// ============================================
export const ViewToggle: React.FC<ViewToggleProps> = ({
  value = 'grid',
  state = 'default',
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const isDisabled = state === 'disabled';

  const classes = [
    'jf-view-toggle',
    isDisabled && 'jf-view-toggle--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <button
        className={`jf-view-toggle__btn ${internalValue === 'grid' ? 'jf-view-toggle__btn--active' : ''}`}
        onClick={!isDisabled ? () => { setInternalValue('grid'); onChange?.('grid'); } : undefined}
        disabled={isDisabled}
        type="button"
        aria-label="Grid view"
      >
        <svg
          className="jf-view-toggle__icon"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" y="0.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="8.5" y="0.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="0.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="8.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>
      <button
        className={`jf-view-toggle__btn ${internalValue === 'list' ? 'jf-view-toggle__btn--active' : ''}`}
        onClick={!isDisabled ? () => { setInternalValue('list'); onChange?.('list'); } : undefined}
        disabled={isDisabled}
        type="button"
        aria-label="List view"
      >
        <svg
          className="jf-view-toggle__icon"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0" y1="1" x2="14" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1="13" x2="14" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export default ViewToggle;
