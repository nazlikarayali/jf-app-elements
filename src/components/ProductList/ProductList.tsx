import { useState, useEffect, type FC } from 'react';
import { Heart, Search, AlignJustify, Grid2x2 } from 'lucide-react';
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
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M6 36L16.58 25.42C17.36 24.64 18.64 24.64 19.42 25.42L30 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M26 32L30.58 27.42C31.36 26.64 32.64 26.64 33.42 27.42L42 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="6" y="6" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2.5" />
  </svg>
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
        <Heart size={24} />
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
          <Heart size={24} />
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
const LAYOUT_ICONS: { layout: ProductListLayout; icon: FC<{ size?: number; className?: string }> }[] = [
  { layout: 'SingleColumn', icon: AlignJustify },
  { layout: 'TwoColumns', icon: Grid2x2 },
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
          <Search size={20} className="jf-product-list__search-icon" />
          <input
            type="text"
            className="jf-product-list__search-input"
            placeholder={searchPlaceholder}
          />
        </div>
        <div className="jf-product-list__layout-switch">
          {LAYOUT_ICONS.map(({ layout: l, icon: Icon }) => (
            <button
              key={l}
              className={`jf-product-list__layout-btn${layout === l ? ' active' : ''}`}
              onClick={() => setLayout(l)}
              title={l}
            >
              <Icon size={18} />
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
