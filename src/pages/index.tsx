import Head from 'next/head';
import { useQuery } from '@apollo/client/react';
import Header from '../components/organisms/Header';
import Footer from '../components/organisms/Footer';
import Hero from '../components/sections/Hero';
import ProductsGrid, { type FeaturedProduct } from '../components/sections/ProductsGrid';
import HomeBanners from '../components/sections/HomeBanners';
import HomeArticles from '../components/sections/HomeArticles';
import { FEATURED_PRODUCTS_MOCK } from '../utils/mockProducts';
import { GET_PRODUCTS } from '../lib/graphql/queries';

type ProductFromApi = {
  id: string;
  name: string;
  slug?: string;
  price?: string | number | null;
  shortDescription?: string | null;
  image?: { sourceUrl?: string | null } | null;
};

type GetProductsData = {
  products?: { nodes?: ProductFromApi[] };
};

type GetProductsVars = { first?: number };

export default function Home() {
  const { data } = useQuery<GetProductsData, GetProductsVars>(GET_PRODUCTS, { variables: { first: 12 } });
  const products = data?.products?.nodes ?? [];
  const FEATURED_CATEGORY = 'Featured Products';
  // Choose products for Home: prefer API data (no categories in current query), otherwise mock filtered by Featured category.
  type FeaturedMock = FeaturedProduct & { categories?: string[] };
  const MOCK: FeaturedMock[] = FEATURED_PRODUCTS_MOCK as unknown as FeaturedMock[];
  const displayProducts: FeaturedProduct[] = products.length > 0
    ? (products as FeaturedProduct[]).slice(0, 6)
    : (MOCK.filter((p) => Array.isArray(p.categories) && p.categories!.includes(FEATURED_CATEGORY)).slice(0, 6)
        || MOCK.slice(0, 6));

  return (
    <>
      <Head>
        <title>Shamanicca — Shop & Audio</title>
        <meta name="description" content="Digital audio and merch" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-8">
          <Header />
          <Hero />
          

          {/* Featured Products section (API or mock JSON fallback) */}
          <ProductsGrid products={displayProducts} />


          {/* Banners */}
          <HomeBanners
            banners={[
              {
                id: 'b1',
                title: 'Magic Accessories',
                subtitle: 'Altar pads, Mose pads, collars, Printed art',
                href: '/shop/accessories',
                imageUrl: 'https://placehold.co/1000x800?text=Img1',
              },
              {
                id: 'b2',
                title: 'Manifestation Audibles',
                subtitle: 'Guides Meditations, Subliminal audios',
                href: '/shop/audios',
                imageUrl: 'https://placehold.co/1000x800?text=Img2',
              },
            ]}
          />

          

          {/* Blog Articles */}
          <HomeArticles
            articles={[
              {
                id: 'a1',
                title: 'Understanding the Wheel of the Year: Celebrating the Sabbats',
                summary:
                  'Pagan holidays, or Sabbats, that mark the turning of the seasons. Learn their history, symbolism, and how to celebrate each one.',
                imageUrl: 'https://placehold.co/345x230',
                href: '/blog/wheel-of-the-year',
              },
              {
                id: 'a2',
                title: 'Protective Sigils 101: Designing Your Own',
                summary: 'A beginner-friendly guide to creating and activating sigils for protection and intention setting.',
                imageUrl: 'https://placehold.co/345x230',
                href: '/blog/protective-sigils',
              },
              {
                id: 'a3',
                title: 'Crystal Grids for Manifestation',
                summary: 'How to choose stones, lay out your grid, and amplify your intentions effectively.',
                imageUrl: 'https://placehold.co/345x230',
                href: '/blog/crystal-grids',
              },
              {
                id: 'a4',
                title: 'Lunar Magic: Working with the Moon Phases',
                summary: 'Harness new moon intentions and full moon release rituals in your practice.',
                imageUrl: 'https://placehold.co/345x230',
                href: '/blog/lunar-magic',
              },
              // {
              //   id: 'a5',
              //   title: 'Herbal Allies: Witch’s Pantry Essentials',
              //   summary: 'Start your apothecary with common herbs and their magical correspondences.',
              //   imageUrl: 'https://placehold.co/345x230',
              //   href: '/blog/herbal-allies',
              // },
              // {
              //   id: 'a6',
              //   title: 'Altars: Building a Sacred Space at Home',
              //   summary: 'Ideas and inspiration for creating meaningful, intentional altar spaces.',
              //   imageUrl: 'https://placehold.co/345x230',
              //   href: '/blog/altars-sacred-space',
              // },
            ]}
          />
          <Footer />
        </main>
      </div>
    </>
  );
}
