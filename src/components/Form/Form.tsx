import type { FC } from 'react';
import { ClipboardList, Asterisk } from 'lucide-react';
import './Form.scss';

export type FormAlignment = 'Left' | 'Center' | 'Right';
export type FormSize = 'Normal' | 'Large';

export interface FormProps {
  alignment?: FormAlignment;
  size?: FormSize;
  label?: string;
  description?: string;
  showIcon?: boolean;
  required?: boolean;
  selected?: boolean;
  shrinked?: boolean;
}

export const Form: FC<FormProps> = ({
  alignment = 'Left',
  size = 'Normal',
  label = 'Form',
  description = 'Type a description',
  showIcon = true,
  required = true,
  selected = false,
  shrinked = false,
}) => {
  const isCenter = alignment === 'Center';
  const isNormal = size === 'Normal';

  const iconSize = isNormal ? 60 : 100;
  const iconInner = isNormal ? 32 : 52;

  const rootClasses = [
    'jf-form',
    isCenter ? 'jf-form--center' : 'jf-form--horizontal',
    alignment === 'Right' && 'jf-form--right',
    selected && 'jf-form--selected',
    shrinked && 'jf-form--shrinked',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      {showIcon && (
        <div className="jf-form__icon" style={{ width: iconSize, height: iconSize }}>
          <ClipboardList size={iconInner} />
        </div>
      )}
      <div className="jf-form__content">
        <div className={`jf-form__title jf-form__title--${isNormal ? 'normal' : 'large'}`}>
          {label}
        </div>
        <div className={`jf-form__desc jf-form__desc--${isNormal ? 'normal' : 'large'}`}>
          {description}
        </div>
      </div>
      {required && (
        <div className="jf-form__badge">
          <Asterisk size={20} />
        </div>
      )}
    </div>
  );
};

export default Form;
