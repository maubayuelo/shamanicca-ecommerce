import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { FEATURED_PRODUCTS_MOCK } from '../../utils/mockProducts';
import Header from '../../components/organisms/Header';
import Footer from '../../components/organisms/Footer';
import ProductsGrid from '../../components/sections/ProductsGrid';
import ProductImageGallery from '../../components/molecules/ProductImageGallery';
import Breadcrumb from '../../components/molecules/Breadcrumb';
import { getSubcategoryBadges } from '../../utils/productSubcategories';

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query as { slug?: string };

  const product = React.useMemo(() => {
    if (!slug) return undefined;
    return FEATURED_PRODUCTS_MOCK.find((p) => p.slug === slug || String(p.id) === slug);
  }, [slug]);

  const title = product?.name || 'Product';
  const isOnSale = product && product.regularPrice && product.price < product.regularPrice;
  const price = product?.price ?? 0;
  const regularPrice = product?.regularPrice ?? price;

  const [size, setSize] = React.useState<string>('');
  const [qty, setQty] = React.useState<number>(1);

  const related = React.useMemo(() => {
    return FEATURED_PRODUCTS_MOCK.filter((p) => p.slug !== product?.slug).slice(0, 4);
  }, [product?.slug]);

  const topCategory = product?.categories?.[0];
  const subcategoryBadge = React.useMemo(() => {
    if (!product) return undefined;
    const badges = getSubcategoryBadges({ name: product.name, slug: product.slug, categories: product.categories }, 1);
    return badges[0];
  }, [product]);

  const categoryHref = topCategory
    ? `/shop/${topCategory.toLowerCase().replace(/\s+/g, '-')}`
    : undefined;

  return (
    <>
      <Head>
        <title>{title} — Shamanicca</title>
      </Head>
      <Header />
      <main className="product-page" role="main">
        <Breadcrumb
            className="main breadcrumb pt-sm-responsive pb-sm-responsive"
            linkLast
            items={[
              { label: 'Home', href: '/' },
              topCategory && categoryHref
                ? { label: topCategory, href: categoryHref }
                : { label: 'Collection' },
              ...(subcategoryBadge ? [{ label: subcategoryBadge.label, href: subcategoryBadge.href }] : []),
            ]}
          />
        <div className="main product">
          <div className="product__content">
            <ProductImageGallery title={title} isOnSale={!!isOnSale} className="product__media" />

            <div className="product__details">
              <h1 className="product__title mt-lg-responsive mb-0 type-5xl">{title}</h1>

              <div className="product__price" aria-live="polite">
                {isOnSale && <div className="regular  type-2xl">${regularPrice.toFixed(2)}</div>}
                <div className="current type-2xl">${price.toFixed(2)}</div>
                {isOnSale && <div className="badge-small type-sm">Save ${Math.max(0, regularPrice - price).toFixed(0)}</div>}
              </div>

              <div className="product__desc">
                This hoodie is more than just clothing; it&apos;s a magical garment designed to bring positivity and protection
                to its wearer. Crafted with care in Montreal, it combines 50% Cotton and 50% Polyester in a classic black
                color.
                <br />
                <br />
                For size assistance, check our size chart{' '}
                <a href="#size-chart" onClick={(e) => e.preventDefault()}>
                  HERE
                </a>
                .
              </div>

              <div className="product__options">
                <div className="field">
                  <label htmlFor="size">Size</label>
                  <select
                    id="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    aria-label="Select size"
                  >
                    <option value="" disabled>
                      Select size
                    </option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="quantity">Quantity</label>
                  <div className="qty-control">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                      aria-live="polite"
                    />
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary btn-large product__cta">ADD TO BAG</button>
            </div>
          </div>
        </div>
          <ProductsGrid
              title="You might also like"
              products={related.slice(0, 3)}
              displayingInHome={false}
              pageSize={3}
              showTitle
              showCTA={false}
              className="product__related pb-lg-responsive"
            />
        <Footer />
      </main>
      
    </>
  );
}
