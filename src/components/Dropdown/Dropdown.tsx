import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import './Dropdown.scss';

// ============================================
// Types
// ============================================
export type DropdownSize = 'sm' | 'md';
export type DropdownState = 'default' | 'focused' | 'disabled';

export interface DropdownProps {
  label?: string;
  description?: string;
  placeholder?: string;
  selectedValue?: string;
  options?: string[];
  open?: boolean;
  state?: DropdownState;
  size?: DropdownSize;
  onChange?: (value: string) => void;
}

// ============================================
// Dropdown Component
// ============================================
export const Dropdown: React.FC<DropdownProps> = ({
  label = 'Label',
  description = '',
  placeholder = 'Select...',
  selectedValue = '',
  options = ['Option 1', 'Option 2', 'Option 3'],
  open = false,
  state = 'default',
  size = 'md',
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const [selected, setSelected] = useState(selectedValue);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsOpen(open); }, [open]);
  useEffect(() => { setSelected(selectedValue); }, [selectedValue]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDisabled = state === 'disabled';

  const handleToggle = () => {
    if (!isDisabled) setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
  };

  const classes = [
    'jf-dropdown',
    `jf-dropdown--${size}`,
    isOpen && 'jf-dropdown--open',
    state === 'focused' && 'jf-dropdown--focused',
    isDisabled && 'jf-dropdown--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} ref={ref}>
      {label && <label className="jf-dropdown__label">{label}</label>}
      <button
        className="jf-dropdown__trigger"
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        <span
          className={`jf-dropdown__value ${!selected ? 'jf-dropdown__value--placeholder' : ''}`}
        >
          {selected || placeholder}
        </span>
        <svg
          className="jf-dropdown__chevron"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="jf-dropdown__panel" role="listbox">
          {options.map((option) => (
            <div
              key={option}
              className={`jf-dropdown__option ${
                option === selected ? 'jf-dropdown__option--selected' : ''
              }`}
              role="option"
              aria-selected={option === selected}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      {description && <p className="jf-dropdown__description">{description}</p>}
    </div>
  );
};

export default Dropdown;
