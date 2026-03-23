import { Fragment, type FC } from 'react';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button';
import { Card } from '../Card';
import type { CardImageStyle, CardLayout, CardAction } from '../Card';
import './List.scss';

export type ListImageStyle = 'Square' | 'Circle' | 'None';
export type ListSize = 'Regular' | 'Compact';
export type ListLayout = 'Basic' | 'Card';
export type ListAction = 'None' | 'Icon' | 'Button';

export interface ListItemData {
  title: string;
  description: string;
}

export type CardSize = 'Small' | 'Medium' | 'Large';

export interface ListProps {
  layout?: ListLayout;
  // Basic layout props
  imageStyle?: ListImageStyle;
  size?: ListSize;
  action?: ListAction;
  actionIconFilled?: boolean;
  buttonLabel?: string;
  // Card layout props
  cardImageStyle?: CardImageStyle;
  cardLayout?: CardLayout;
  cardAction?: CardAction;
  cardActionIconFilled?: boolean;
  cardButtonLabel?: string;
  cardSize?: CardSize;
  // Common
  selected?: boolean;
  items?: ListItemData[];
}

// ============================================
// Image Placeholder
// ============================================
const ImagePlaceholder: FC<{ size: number }> = ({ size: s }) => (
  <Icon name="Image" size={s} />
);

// ============================================
// Action element (matches Card component style)
// ============================================
const ListActionEl: FC<{ action: ListAction; actionIconFilled: boolean; buttonLabel: string }> = ({ action, actionIconFilled, buttonLabel }) => {
  if (action === 'None') return null;
  if (action === 'Icon') {
    return (
      <Button
        iconOnly
        iconOnlyIcon="ChevronRight"
        iconOnlyFilled={actionIconFilled}
        corner="Default"
      />
    );
  }
  return (
    <button className="jf-card__action-button">
      {buttonLabel}
    </button>
  );
};

// ============================================
// Basic List Item
// ============================================
const BasicListItem: FC<{
  item: ListItemData;
  imageStyle: ListImageStyle;
  size: ListSize;
  action: ListAction;
  actionIconFilled: boolean;
  buttonLabel: string;
}> = ({ item, imageStyle, size, action, actionIconFilled, buttonLabel }) => {
  const isCompact = size === 'Compact';
  const imgSize = isCompact ? 60 : 104;
  const iconSize = isCompact ? 32 : 48;
  const hasImage = imageStyle !== 'None';

  return (
    <div className={`jf-list-item jf-list-item--basic${isCompact ? ' jf-list-item--compact' : ''}`}>
      {hasImage && (
        <div className={`jf-list-item__image jf-list-item__image--${imageStyle.toLowerCase()}`} style={{ width: imgSize, height: imgSize }}>
          <ImagePlaceholder size={iconSize} />
        </div>
      )}
      <div className="jf-list-item__content">
        <div className="jf-list-item__info">
          <div className="jf-list-item__title">{item.title}</div>
          <div className="jf-list-item__desc">{item.description}</div>
        </div>
        <ListActionEl action={action} actionIconFilled={actionIconFilled} buttonLabel={buttonLabel} />
      </div>
    </div>
  );
};

// ============================================
// List Component
// ============================================
const DEFAULT_ITEMS: ListItemData[] = [
  { title: 'Card Title', description: 'Description' },
  { title: 'Card Title', description: 'Description' },
  { title: 'Card Title', description: 'Description' },
  { title: 'Card Title', description: 'Description' },
];

export const List: FC<ListProps> = ({
  layout = 'Basic',
  imageStyle = 'Square',
  size = 'Regular',
  action = 'None',
  actionIconFilled = true,
  buttonLabel = 'Edit',
  cardImageStyle = 'Square',
  cardLayout = 'Horizontal',
  cardAction = 'None',
  cardActionIconFilled = true,
  cardButtonLabel = 'Edit',
  cardSize = 'Medium',
  selected = false,
  items = DEFAULT_ITEMS,
}) => {
  if (layout === 'Card') {
    const isVertical = cardLayout === 'Vertical';
    const gridClass = isVertical
      ? `jf-list__card-grid--${cardSize.toLowerCase()}`
      : '';

    return (
      <div className={`jf-list jf-list--card${selected ? ' jf-list--selected' : ''}`}>
        <div className={`jf-list__card-grid ${gridClass}`}>
          {items.map((item, i) => (
            <Card
              key={i}
              imageStyle={cardImageStyle}
              layout={cardLayout}
              action={cardAction}
              actionIconFilled={cardActionIconFilled}
              title={item.title}
              description={item.description}
              buttonLabel={cardButtonLabel}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`jf-list jf-list--basic${selected ? ' jf-list--selected' : ''}`}>
      {items.map((item, i) => (
        <Fragment key={i}>
          <BasicListItem item={item} imageStyle={imageStyle} size={size} action={action} actionIconFilled={actionIconFilled} buttonLabel={buttonLabel} />
          {i < items.length - 1 && <div className="jf-list__divider" />}
        </Fragment>
      ))}
    </div>
  );
};

export default List;
