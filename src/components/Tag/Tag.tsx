import { useState } from 'react';
import type React from 'react';
import { Icon } from '../Icon/Icon';
import './Tag.scss';

// ============================================
// Types
// ============================================
export type TagVariant = 'default' | 'brand' | 'success' | 'warning' | 'error' | 'info';
export type TagSize = 'sm' | 'md';
export type TagState = 'default' | 'hover' | 'disabled';

export interface TagProps {
  label?: string;
  variant?: TagVariant;
  size?: TagSize;
  removable?: boolean;
  state?: TagState;
  onRemove?: () => void;
}

// ============================================
// Tag Component
// ============================================
export const Tag: React.FC<TagProps> = ({
  label = 'Tag',
  variant = 'default',
  size = 'md',
  removable = false,
  state = 'default',
  onRemove,
}) => {
  const [visible, setVisible] = useState(true);
  const isDisabled = state === 'disabled';

  if (!visible) return null;

  const classes = [
    'jf-tag',
    `jf-tag--${variant}`,
    `jf-tag--${size}`,
    state === 'hover' && 'jf-tag--hovered',
    isDisabled && 'jf-tag--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = size === 'sm' ? 10 : 12;

  return (
    <span className={classes}>
      <span className="jf-tag__label">{label}</span>
      {removable && (
        <button
          className="jf-tag__remove"
          onClick={isDisabled ? undefined : () => { setVisible(false); onRemove?.(); }}
          disabled={isDisabled}
          type="button"
          aria-label={`Remove ${label}`}
        >
          <Icon name="X" className="jf-tag__remove-icon" size={iconSize} />
        </button>
      )}
    </span>
  );
};

export default Tag;
