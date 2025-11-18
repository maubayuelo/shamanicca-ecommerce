import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import Paginator from '../molecules/Paginator';

export type FeaturedProduct = {
  id: string | number;
  name: string;
  slug?: string;
  image?: { sourceUrl?: string } | null;
  price?: string | number | null;
  regularPrice?: string | number | null; // if present and > price, show SALE + strikethrough
  shortDescription?: string | null;
};

export type ProductGridItem = FeaturedProduct;

export type ProductsGridProps = {
  title?: string;
  products: FeaturedProduct[];
  allProductsHref?: string;
  className?: string;
  /**
   * When true, indicates the component is displayed on the Home page.
   * Used to render Home-only UI like the section title and the section footer CTA.
   * Defaults to true so Home keeps existing behavior; category pages should pass false.
   */
  displayingInHome?: boolean;
  /**
   * Force showing/hiding the title independently of displayingInHome.
   * Defaults to following displayingInHome when undefined.
   */
  showTitle?: boolean;
  /**
   * Force showing/hiding the footer CTA independently of displayingInHome.
   * Defaults to following displayingInHome when undefined.
   */
  showCTA?: boolean;
  /**
   * Items per page when pagination is active. Default: 6
   */
  pageSize?: number;
  /**
   * Optional controlled current page (1-based). If omitted, the grid manages its own page.
   */
  currentPage?: number;
  /**
   * Called when page changes (only used if currentPage is provided, or when consumer wants to listen).
   */
  onPageChange?: (page: number) => void;
  /**
   * If provided, paginator will render each page as a Link using this builder.
   * Useful for SSR/Next routing like (page) => `/category/slug?page=${page}`.
   */
  hrefBuilder?: (page: number) => string;
  /**
   * Optional total count if data is server-paginated; falls back to products.length.
   */
  totalCount?: number;
};

/**
 * Responsive Products Grid section
 * - Mobile: 1 column
 * - Tablet (sm/md): 2 columns
 * - Desktop (lg+): 3 columns
 * Inspired by Figma markup in _figma_code/component-product-listing.txt
 */
export default function ProductsGrid({
  title = 'Featured Products',
  products,
  allProductsHref = '/products',
  className = '',
  displayingInHome = true,
  showTitle,
  showCTA,
  pageSize = 6,
  currentPage,
  onPageChange,
  hrefBuilder,
  totalCount,
}: ProductsGridProps) {
  // Only paginate on category/listing contexts (not Home) and when over pageSize
  const totalItems = totalCount ?? products?.length ?? 0;
  const shouldPaginate = !displayingInHome && totalItems > pageSize;

  const [internalPage, setInternalPage] = React.useState(1);
  const activePage = Math.max(1, Math.min(currentPage ?? internalPage, Math.ceil(totalItems / pageSize) || 1));
  const totalPages = shouldPaginate ? Math.ceil(totalItems / pageSize) : 1;

  const startIndex = shouldPaginate ? (activePage - 1) * pageSize : 0;
  const endIndex = shouldPaginate ? startIndex + pageSize : products?.length ?? 0;
  const visibleProducts = shouldPaginate ? products.slice(startIndex, endIndex) : products;

  const handlePageChange = (page: number) => {
    if (onPageChange) onPageChange(page);
    if (currentPage == null) setInternalPage(page);
  };

  const shouldShowTitle = showTitle ?? displayingInHome;
  const shouldShowCTA = showCTA ?? displayingInHome;

  return (
    <section className={`section-featured-products main pb-lg-responsive ${className}`}>
      {shouldShowTitle && (
        <h2 className="section-title type-4xl type-extrabold mt-lg-responsive mb-md-responsive">{title}</h2>
      )}

      <div className="product-grid">
        {visibleProducts?.map((p) => (
          <ProductTile key={p.id} product={p} />
        ))}
      </div>
      {shouldShowCTA && (
        <div className="section-featured-products__section-footer mt-md-responsive mb-xl-responsive">
          <Link href={allProductsHref} className="btn btn-secondary btn-large m-0">Check All Products</Link>
        </div>
      )}
      {/* Section paginator */}
      {shouldPaginate && totalPages > 1 && (
        <div className="section-paginator mt-md-responsive">
          <Paginator
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={activePage}
            onPageChange={handlePageChange}
            hrefBuilder={hrefBuilder}
          />
        </div>
      )}
    </section>
  );
}

function ProductTile({ product }: { product: FeaturedProduct }) {
  const img = product?.image?.sourceUrl || 'https://placehold.co/800x800?text=Product';
  const name = product?.name ?? '';
  const price = product?.price ?? undefined;
  const regularPrice = product?.regularPrice ?? undefined;
  const onSale = price != null && regularPrice != null && String(regularPrice) !== String(price);
  const href = `/products/${product?.slug || product?.id}`;

  return (
    <article className="product-tile">
      <Link href={href} aria-label={`View ${name}`} className="image-wrap">
        {onSale && <div className="product-badge type-sm type-bold">SALE</div>}
        <Image src={img} alt={name} width={800} height={800} loading="lazy" />
      </Link>
      <div className="info">
        <h3 className="product-name type-lg type-bold mt-sm-responsive  mb-xs-responsive">
          <Link href={href} aria-label={`View ${name}`}>{name}</Link>
        </h3>
        <div className="prices">
          {onSale && <span className="price-compare type-lg">{formatPrice(regularPrice)}</span>}
          <span className="price type-lg">{formatPrice(price)}</span>
        </div>
      </div>
    </article>
  );
}

function formatPrice(value: unknown): string {
  if (value == null) return '';
  const n = Number(value);
  if (Number.isFinite(n)) return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
  // assume string like "$199"
  return String(value);
}
