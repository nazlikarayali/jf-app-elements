import { useState, useEffect } from 'react';
import type React from 'react';
import './RadioButton.scss';

// ============================================
// Types
// ============================================
export type RadioButtonState = 'default' | 'hover' | 'disabled';
export type RadioButtonSize = 'sm' | 'md';

export interface RadioButtonProps {
  label?: string;
  checked?: boolean;
  state?: RadioButtonState;
  size?: RadioButtonSize;
  onChange?: () => void;
}

// ============================================
// RadioButton Component
// ============================================
export const RadioButton: React.FC<RadioButtonProps> = ({
  label = 'Radio option',
  checked = false,
  state = 'default',
  size = 'md',
  onChange,
}) => {
  const [internalChecked, setInternalChecked] = useState(checked);

  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const isDisabled = state === 'disabled';

  const handleClick = () => {
    if (!isDisabled) {
      setInternalChecked(true);
      onChange?.();
    }
  };

  const classes = [
    'jf-radio',
    `jf-radio--${size}`,
    internalChecked && 'jf-radio--checked',
    state === 'hover' && 'jf-radio--hover',
    isDisabled && 'jf-radio--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={classes} onClick={handleClick}>
      <span className="jf-radio__circle">
        <span className="jf-radio__dot" />
      </span>
      <span className="jf-radio__label">{label}</span>
    </label>
  );
};

export default RadioButton;
