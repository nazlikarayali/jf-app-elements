import type { FC } from 'react';
import { Table2, Asterisk } from 'lucide-react';
import './Table.scss';

export type TableAlignment = 'Left' | 'Center' | 'Right';
export type TableSize = 'Normal' | 'Large';

export interface TableProps {
  alignment?: TableAlignment;
  size?: TableSize;
  label?: string;
  description?: string;
  showIcon?: boolean;
  required?: boolean;
  selected?: boolean;
  shrinked?: boolean;
}

export const Table: FC<TableProps> = ({
  alignment = 'Left',
  size = 'Normal',
  label = 'Table',
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
    'jf-table',
    isCenter ? 'jf-table--center' : 'jf-table--horizontal',
    alignment === 'Right' && 'jf-table--right',
    selected && 'jf-table--selected',
    shrinked && 'jf-table--shrinked',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      {showIcon && (
        <div className="jf-table__icon" style={{ width: iconSize, height: iconSize }}>
          <Table2 size={iconInner} />
        </div>
      )}
      <div className="jf-table__content">
        <div className={`jf-table__title jf-table__title--${isNormal ? 'normal' : 'large'}`}>
          {label}
        </div>
        <div className={`jf-table__desc jf-table__desc--${isNormal ? 'normal' : 'large'}`}>
          {description}
        </div>
      </div>
      {required && (
        <div className="jf-table__badge">
          <Asterisk size={20} />
        </div>
      )}
    </div>
  );
};

export default Table;
