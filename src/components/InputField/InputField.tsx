import { useState, useEffect } from 'react';
import type React from 'react';
import './InputField.scss';

// ============================================
// Types
// ============================================
export type InputFieldState = 'default' | 'focused' | 'filled' | 'error' | 'disabled';
export type InputFieldSize = 'sm' | 'md';

export interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  helperText?: string;
  state?: InputFieldState;
  size?: InputFieldSize;
  onChange?: (value: string) => void;
}

// ============================================
// InputField Component
// ============================================
export const InputField: React.FC<InputFieldProps> = ({
  label = 'Label',
  placeholder = 'Placeholder...',
  value = '',
  helperText = '',
  state = 'default',
  size = 'md',
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(state === 'focused');

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const isDisabled = state === 'disabled';
  const isError = state === 'error';

  const computedState = isDisabled
    ? 'disabled'
    : isError
      ? 'error'
      : isFocused
        ? 'focused'
        : internalValue
          ? 'filled'
          : 'default';

  const classes = [
    'jf-input',
    `jf-input--${computedState}`,
    `jf-input--${size}`,
  ]
    .filter(Boolean)
    .join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setInternalValue(next);
    onChange?.(next);
  };

  return (
    <div className={classes}>
      {label && <label className="jf-input__label">{label}</label>}
      <input
        className="jf-input__field"
        type="text"
        placeholder={placeholder}
        value={internalValue}
        disabled={isDisabled}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {helperText && <span className="jf-input__helper">{helperText}</span>}
    </div>
  );
};

export default InputField;
