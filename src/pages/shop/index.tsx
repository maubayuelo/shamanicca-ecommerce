import Head from 'next/head';
import { GetStaticProps } from 'next';
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import ProductListing, { type ProductListingProduct } from '../../components/sections/ProductListing';
import ProductsGrid from '../../components/sections/ProductsGrid';
import StoreSubHeader from '../../components/sections/StoreSubHeader';
import Header from '../../components/organisms/Header';
import Footer from '../../components/organisms/Footer';
import { FEATURED_PRODUCTS_MOCK } from '../../utils/mockProducts';
import { SUBCATEGORY_KEYWORDS } from '../../utils/productSubcategories';
import navigation from '../../utils/navigation';

// Keep categories consistent with [category].tsx for client-side filtering support
const CATEGORIES = ['women', 'men', 'accessories', 'mystical-home', 'best-sellers'] as const;
type Category = (typeof CATEGORIES)[number];

type Props = {
  products: ProductListingProduct[];
};

export default function ShopPage({ products }: Props) {
  const router = useRouter();
  const categoryParam = typeof router.query.category === 'string' ? (router.query.category.toLowerCase() as Category) : undefined;
  const subParam = typeof router.query.sub === 'string' ? router.query.sub : undefined;

  const baseProducts = useMemo(() => {
    if (!categoryParam || !CATEGORIES.includes(categoryParam)) return products;
    return pickProductsForCategory(categoryParam);
  }, [products, categoryParam]);

  const filteredProducts = useMemo(() => {
    if (!subParam) return baseProducts;
    const keywords = SUBCATEGORY_KEYWORDS[subParam];
    if (!keywords || !keywords.length) return baseProducts;
    const normKeywords = keywords.map((k) => k.toLowerCase());
    return baseProducts.filter((p) => {
      const hay = `${p.name} ${p.slug}`.toLowerCase();
      return normKeywords.some((kw) => hay.includes(kw));
    });
  }, [baseProducts, subParam]);

  const subTitle = subParam ? toSubLabel(subParam) : undefined;
  const categoryTitle = categoryParam && CATEGORIES.includes(categoryParam) ? toTitle(categoryParam) : 'Shop';
  const listingTitle = subTitle ? `${categoryTitle} — ${subTitle}` : categoryTitle;

  return (
    <>
      <Head>
        <title>{listingTitle} — Shamanicca</title>
      </Head>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          <Header />
          <StoreSubHeader categoryTitle={categoryTitle} subCategoryTitle={subTitle} />
          {categoryParam === 'best-sellers' ? (
            <ProductsGrid
              title={categoryTitle}
              products={filteredProducts}
              displayingInHome={false}
              showCTA={false}
              showTitle={false}
              allProductsHref={`/shop`}
            />
          ) : (
            <ProductListing
              title={listingTitle}
              products={filteredProducts}
              allProductsHref={`/shop`}
            />
          )}
          <Footer />
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Use mock products for now; swap to WP/WooCommerce data when ready
  const products = normalize(FEATURED_PRODUCTS_MOCK);
  return {
    props: {
      products,
    },
    revalidate: 60,
  };
};

function toTitle(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function pickProductsForCategory(category: Category): ProductListingProduct[] {
  const all = FEATURED_PRODUCTS_MOCK;
  if (category === 'best-sellers') {
    const best = all.filter((p: any) => p.bestSeller === true);
    return normalize(best);
  }
  const byKeyword = all.filter((p) => {
    const name = (p.name || '').toLowerCase();
    switch (category) {
      case 'women':
        return name.includes('women') || name.includes('darlin') || name.includes('veil');
      case 'men':
        return name.includes('hoodie') || name.includes('urban') || name.includes('street');
      case 'accessories':
        return name.includes('accessor');
      case 'mystical-home':
        return (
          name.includes('mug') ||
          name.includes('water bottle') || name.includes('bottle') ||
          name.includes('wall art') || name.includes('poster') || name.includes('print') || name.includes('canvas') ||
          name.includes('sticker') || name.includes('tapestry') ||
          name.includes('talisman') || name.includes('pendant') || name.includes('necklace') || name.includes('amulet') ||
          name.includes('candle') ||
          name.includes('crystal')
        );
    }
  });
  const list = byKeyword.length ? byKeyword : all;
  return normalize(list);
}

function normalize(list: any[]): ProductListingProduct[] {
  return list.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: p.image,
    price: p.price,
    regularPrice: p.regularPrice,
  }));
}

function toSubLabel(subId: string): string {
  for (const parent of navigation) {
    if (!Array.isArray(parent.children)) continue;
    const found = parent.children.find((c) => c.id === subId);
    if (found) return found.label;
  }
  return subId
    .split('-')
    .filter((p) => !['men','women','acc','altar','mystic'].includes(p))
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}
