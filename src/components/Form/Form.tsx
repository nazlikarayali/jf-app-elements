import type { FC } from 'react';
import { ClipboardList, Asterisk, CloudUpload, Trash2 } from 'lucide-react';
import { Button } from '../Button';
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
  showForm?: boolean;
  showBorder?: boolean;
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
  showForm = false,
  showBorder = true,
}) => {
  if (showForm) {
    const openClasses = [
      'jf-form-open',
      !showBorder && 'jf-form-open--no-border',
      selected && 'jf-form-open--selected',
    ].filter(Boolean).join(' ');

    return (
      <div className={openClasses}>
        {/* Name Fields */}
        <div className="jf-form-open__section">
          <div className="jf-form-open__row">
            <div className="jf-form-open__field">
              <label className="jf-form-open__label">Name</label>
              <input type="text" className="jf-form-open__input" />
              <span className="jf-form-open__hint">First Name</span>
            </div>
            <div className="jf-form-open__field">
              <label className="jf-form-open__label jf-form-open__label--hidden">Name</label>
              <input type="text" className="jf-form-open__input" />
              <span className="jf-form-open__hint">Last Name</span>
            </div>
          </div>

          {/* Phone Number */}
          <div className="jf-form-open__field">
            <label className="jf-form-open__label">Phone Number</label>
            <input type="tel" className="jf-form-open__input" placeholder="(000) 000-0000" />
            <span className="jf-form-open__hint">Please enter a valid phone number</span>
          </div>
        </div>

        {/* Image Upload */}
        <div className="jf-form-open__field">
          <label className="jf-form-open__label">Image</label>
          <div className="jf-form-open__upload">
            <CloudUpload size={32} className="jf-form-open__upload-icon" />
            <div className="jf-form-open__upload-text">
              <span className="jf-form-open__upload-title">Browse Files</span>
              <span className="jf-form-open__upload-desc">Drag and drop files here</span>
            </div>
          </div>
          <div className="jf-form-open__file">
            <div className="jf-form-open__file-preview" />
            <span className="jf-form-open__file-name">Screens...766.png</span>
            <button className="jf-form-open__file-delete">
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="jf-form-open__buttons">
          <Button variant="Outlined" label="Save" leftIcon="none" rightIcon="none" fullWidth />
          <Button variant="Default" label="Submit" leftIcon="none" rightIcon="none" fullWidth />
        </div>
      </div>
    );
  }

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
