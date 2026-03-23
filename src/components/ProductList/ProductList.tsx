import { useState, useEffect, type FC } from 'react';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button';
import './ProductList.scss';

export type ProductListLayout = 'ThreeColumns' | 'TwoColumns' | 'SingleColumn';

export interface ProductItem {
  name: string;
  price: string;
}

export interface ProductListProps {
  layout?: ProductListLayout;
  title?: string;
  searchPlaceholder?: string;
  buttonLabel?: string;
  selected?: boolean;
  shrinked?: boolean;
  products?: ProductItem[];
}

// ============================================
// Image Placeholder
// ============================================
const ImagePlaceholder: FC<{ size?: number }> = ({ size = 80 }) => (
  <Icon name="Image" size={size} />
);

// ============================================
// Card Item (used in 2/3 column layouts)
// ============================================
const ProductCardItem: FC<{ product: ProductItem; buttonLabel: string }> = ({
  product,
  buttonLabel,
}) => (
  <div className="jf-product-item jf-product-item--card">
    <div className="jf-product-item__image">
      <ImagePlaceholder />
      <button className="jf-product-item__like">
        <Icon name="Heart" size={24} />
      </button>
    </div>
    <div className="jf-product-item__content">
      <div className="jf-product-item__info">
        <p className="jf-product-item__name">{product.name}</p>
        <p className="jf-product-item__price">{product.price}</p>
      </div>
      <div className="jf-product-item__action">
        <Button
          variant="Default"
          corner="Default"
          size="Small"
          label={buttonLabel}
          leftIcon="none"
          rightIcon="none"
          fullWidth
          shrinked
        />
      </div>
    </div>
  </div>
);

// ============================================
// Basic Item (used in single column layout)
// ============================================
const ProductBasicItem: FC<{ product: ProductItem; buttonLabel: string }> = ({
  product,
  buttonLabel,
}) => (
  <div className="jf-product-item jf-product-item--basic">
    <div className="jf-product-item__image-basic">
      <ImagePlaceholder size={56} />
    </div>
    <div className="jf-product-item__body">
      <div className="jf-product-item__info">
        <p className="jf-product-item__name">{product.name}</p>
        <p className="jf-product-item__price">{product.price}</p>
      </div>
      <div className="jf-product-item__right">
        <button className="jf-product-item__like jf-product-item__like--inline">
          <Icon name="Heart" size={24} />
        </button>
        <Button
          variant="Default"
          corner="Default"
          size="Small"
          label={buttonLabel}
          leftIcon="none"
          rightIcon="none"
          shrinked
        />
      </div>
    </div>
  </div>
);

// ============================================
// Layout Switch Icons
// ============================================
const LAYOUT_ICONS: { layout: ProductListLayout; iconName: string }[] = [
  { layout: 'SingleColumn', iconName: 'List' },
  { layout: 'TwoColumns', iconName: 'Grid2x2' },
];

// ============================================
// Product List Component
// ============================================
const DEFAULT_PRODUCTS: ProductItem[] = [
  { name: 'Product Name', price: '$10.00' },
  { name: 'Product Name', price: '$10.00' },
  { name: 'Product Name', price: '$10.00' },
  { name: 'Product Name', price: '$10.00' },
];

export const ProductList: FC<ProductListProps> = ({
  layout: initialLayout = 'TwoColumns',
  title = 'Products',
  searchPlaceholder = 'Search Products',
  buttonLabel = 'Add to Cart',
  selected = false,
  shrinked = false,
  products = DEFAULT_PRODUCTS,
}) => {
  const [layout, setLayout] = useState<ProductListLayout>(initialLayout);

  useEffect(() => {
    setLayout(initialLayout);
  }, [initialLayout]);

  const isSingle = layout === 'SingleColumn';

  const rootClasses = [
    'jf-product-list',
    selected && 'jf-product-list--selected',
    shrinked && 'jf-product-list--shrinked',
  ].filter(Boolean).join(' ');

  const gridClasses = [
    'jf-product-list__grid',
    layout === 'ThreeColumns' && 'jf-product-list__grid--3col',
    layout === 'TwoColumns' && 'jf-product-list__grid--2col',
    layout === 'SingleColumn' && 'jf-product-list__grid--1col',
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      {/* Title */}
      <h3 className="jf-product-list__title">{title}</h3>

      {/* Toolbar: Search + Layout Icons */}
      <div className="jf-product-list__toolbar">
        <div className="jf-product-list__search">
          <Icon name="Search" size={20} className="jf-product-list__search-icon" />
          <input
            type="text"
            className="jf-product-list__search-input"
            placeholder={searchPlaceholder}
          />
        </div>
        <div className="jf-product-list__layout-switch">
          {LAYOUT_ICONS.map(({ layout: l, iconName }) => (
            <button
              key={l}
              className={`jf-product-list__layout-btn${layout === l ? ' active' : ''}`}
              onClick={() => setLayout(l)}
              title={l}
            >
              <Icon name={iconName} size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className={gridClasses}>
        {products.map((product, i) =>
          isSingle ? (
            <ProductBasicItem key={i} product={product} buttonLabel={buttonLabel} />
          ) : (
            <ProductCardItem key={i} product={product} buttonLabel={buttonLabel} />
          )
        )}
      </div>
    </div>
  );
};

export default ProductList;
