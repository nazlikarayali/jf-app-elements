import type { FC } from 'react';
import { FilePenLine, Asterisk } from 'lucide-react';
import './SignDocument.scss';

export type SignDocumentAlignment = 'Left' | 'Center' | 'Right';
export type SignDocumentSize = 'Normal' | 'Large';

export interface SignDocumentProps {
  alignment?: SignDocumentAlignment;
  size?: SignDocumentSize;
  label?: string;
  description?: string;
  showIcon?: boolean;
  required?: boolean;
  selected?: boolean;
  shrinked?: boolean;
}

export const SignDocument: FC<SignDocumentProps> = ({
  alignment = 'Left',
  size = 'Normal',
  label = 'Sign Document',
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
    'jf-sign-doc',
    isCenter ? 'jf-sign-doc--center' : 'jf-sign-doc--horizontal',
    alignment === 'Right' && 'jf-sign-doc--right',
    selected && 'jf-sign-doc--selected',
    shrinked && 'jf-sign-doc--shrinked',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      {showIcon && (
        <div className="jf-sign-doc__icon" style={{ width: iconSize, height: iconSize }}>
          <FilePenLine size={iconInner} />
        </div>
      )}
      <div className="jf-sign-doc__content">
        <div className={`jf-sign-doc__title jf-sign-doc__title--${isNormal ? 'normal' : 'large'}`}>
          {label}
        </div>
        <div className={`jf-sign-doc__desc jf-sign-doc__desc--${isNormal ? 'normal' : 'large'}`}>
          {description}
        </div>
      </div>
      {required && (
        <div className="jf-sign-doc__badge">
          <Asterisk size={20} />
        </div>
      )}
    </div>
  );
};

export default SignDocument;
