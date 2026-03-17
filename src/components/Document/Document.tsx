import { useState, type FC, type DragEvent } from 'react';
import { FileText, CirclePlus } from 'lucide-react';
import { Button } from '../Button';
import './Document.scss';

export type DocumentAlignment = 'Left' | 'Center' | 'Right';
export type DocumentSize = 'Normal' | 'Large';

export interface DocumentProps {
  alignment?: DocumentAlignment;
  size?: DocumentSize;
  fileName?: string;
  description?: string;
  showIcon?: boolean;
  hasFile?: boolean;
  selected?: boolean;
  shrinked?: boolean;
}

export const Document: FC<DocumentProps> = ({
  alignment = 'Left',
  size = 'Normal',
  fileName = 'File Name',
  description = 'Add Description',
  showIcon = true,
  hasFile = true,
  selected = false,
  shrinked = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // =====================
  // Builder state (no file uploaded)
  // =====================
  if (!hasFile) {
    const builderClasses = [
      'jf-doc-builder',
      isDragging && 'jf-doc-builder--active',
      selected && 'jf-doc-builder--selected',
      shrinked && 'jf-doc-builder--shrinked',
    ].filter(Boolean).join(' ');

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    return (
      <div
        className={builderClasses}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDragging ? (
          <>
            <CirclePlus size={20} className="jf-doc-builder__drop-icon" />
            <span className="jf-doc-builder__hint">DRAG AND DROP HERE</span>
          </>
        ) : (
          <>
            <FileText size={32} className="jf-doc-builder__icon" />
            <Button
              variant="Default"
              corner="Default"
              size="Small"
              label="Upload File"
              leftIcon="Upload"
              rightIcon="none"
              shrinked
            />
            <span className="jf-doc-builder__hint">OR DRAG AND DROP HERE</span>
          </>
        )}
      </div>
    );
  }

  // =====================
  // Document with file
  // =====================
  const isCenter = alignment === 'Center';
  const isNormal = size === 'Normal';

  const iconSize = isNormal ? 60 : 100;
  const iconInner = isNormal ? 32 : 52;

  const rootClasses = [
    'jf-doc',
    isCenter ? 'jf-doc--center' : 'jf-doc--horizontal',
    alignment === 'Right' && 'jf-doc--right',
    selected && 'jf-doc--selected',
    shrinked && 'jf-doc--shrinked',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      {showIcon && (
        <div className="jf-doc__icon" style={{ width: iconSize, height: iconSize }}>
          <FileText size={iconInner} />
        </div>
      )}
      <div className="jf-doc__content">
        <div className={`jf-doc__title jf-doc__title--${isNormal ? 'normal' : 'large'}`}>
          {fileName}
        </div>
        <div className={`jf-doc__desc jf-doc__desc--${isNormal ? 'normal' : 'large'}`}>
          {description}
        </div>
      </div>
    </div>
  );
};

export default Document;
