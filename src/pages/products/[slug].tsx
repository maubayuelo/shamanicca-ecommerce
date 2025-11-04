import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { FEATURED_PRODUCTS_MOCK } from '../../utils/mockProducts';
import Header from '../../components/organisms/Header';
import Footer from '../../components/organisms/Footer';
import ProductsGrid from '../../components/sections/ProductsGrid';
import ProductImageGallery from '../../components/molecules/ProductImageGallery';

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query as { slug?: string };

  const product = React.useMemo(() => {
    if (!slug) return undefined;
    return FEATURED_PRODUCTS_MOCK.find((p) => p.slug === slug || String(p.id) === slug);
  }, [slug]);

  const title = product?.name || 'Product';
  const img = product?.image?.sourceUrl || 'https://placehold.co/1000x1000?text=Product';
  const isOnSale = product && product.regularPrice && product.price < product.regularPrice;
  const price = product?.price ?? 0;
  const regularPrice = product?.regularPrice ?? price;

  const [size, setSize] = React.useState<string>('');
  const [qty, setQty] = React.useState<number>(1);

  const related = React.useMemo(() => {
    return FEATURED_PRODUCTS_MOCK.filter((p) => p.slug !== product?.slug).slice(0, 4);
  }, [product?.slug]);

  return (
    <>
      <Head>
        <title>{title} — Shamanicca</title>
      </Head>
      <Header />
      <main className="main product-page" role="main">
        <div className="product">
          <nav className="product__breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep" aria-hidden="true" />
            <span>{product?.categories?.[0] || 'Collection'}</span>
            <span className="sep" aria-hidden="true" />
            <span className="current">{title}</span>
          </nav>

          <div className="product__content">
            <ProductImageGallery title={title} isOnSale={!!isOnSale} className="product__media" />

            <div className="product__details">
              <h1 className="product__title">{title}</h1>

              <div className="product__price" aria-live="polite">
                {isOnSale && <div className="regular  type-xl">${regularPrice.toFixed(2)}</div>}
                <div className="current type-lg">${price.toFixed(2)}</div>
                {isOnSale && <div className="badge-small type-xl">Save ${Math.max(0, regularPrice - price).toFixed(0)}</div>}
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

          <ProductsGrid
            title="You might also like"
            products={related.slice(0, 3)}
            displayingInHome={false}
            pageSize={3}
            showTitle
            showCTA={false}
            className="product__related"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
