import { useState, useEffect } from 'react';
import type React from 'react';
import './Checkbox.scss';

// ============================================
// Types
// ============================================
export type CheckboxSize = 'sm' | 'md';
export type CheckboxState = 'default' | 'hover' | 'disabled';

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  state?: CheckboxState;
  size?: CheckboxSize;
  onChange?: (checked: boolean) => void;
}

// ============================================
// Checkbox Component
// ============================================
export const Checkbox: React.FC<CheckboxProps> = ({
  label = 'Checkbox label',
  checked = false,
  indeterminate = false,
  state = 'default',
  size = 'md',
  onChange,
}) => {
  const [internalChecked, setInternalChecked] = useState(checked);

  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const isDisabled = state === 'disabled';
  const isActive = internalChecked || indeterminate;

  const classes = [
    'jf-checkbox',
    `jf-checkbox--${size}`,
    isActive && 'jf-checkbox--checked',
    indeterminate && 'jf-checkbox--indeterminate',
    state === 'hover' && 'jf-checkbox--hovered',
    isDisabled && 'jf-checkbox--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  const boxSize = size === 'sm' ? 16 : 20;

  const handleClick = () => {
    if (!isDisabled) {
      const next = !internalChecked;
      setInternalChecked(next);
      onChange?.(next);
    }
  };

  return (
    <label className={classes} onClick={handleClick}>
      <span className="jf-checkbox__box" style={{ width: boxSize, height: boxSize }}>
        {checked && !indeterminate && (
          <svg
            className="jf-checkbox__icon"
            width={boxSize}
            height={boxSize}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              points="4 10 8 14 16 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        )}
        {indeterminate && (
          <svg
            className="jf-checkbox__icon"
            width={boxSize}
            height={boxSize}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="5"
              y1="10"
              x2="15"
              y2="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span className="jf-checkbox__label">{label}</span>
    </label>
  );
};

export default Checkbox;
