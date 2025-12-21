import React from 'react';
import Breadcrumb from '../molecules/Breadcrumb';
import BlogGrid, { type BlogGridItem } from './BlogGrid';
import BlogHeader from './BlogHeader';
import BlogBanner from './BlogBanner';
import BlogSidebar from './BlogSidebar';
import BlogMainArticle from './BlogMainArticle';

type BlogMainPageProps = {
  posts: BlogGridItem[];
};

export default function BlogMainPage({ posts }: BlogMainPageProps) {
  // Derive layout pieces: first item as main article, then 3 blocks, banners in-between
  const mainArticle = posts[0];
  const remaining = posts.slice(1);
  const block1 = remaining.slice(0, 6);
  const block2 = remaining.slice(6, 10);
  const block3 = remaining.slice(10, 14);



  const sampleBanners = [
    {
      imageUrl: 'https://placehold.co/270x270.png',
      title: 'Intentioned Apparel',
      subtitle: 'Wear your protection. Embody your abundance.',
      ctaLabel: 'SHOP NOW!',
      href: '/shop',
    },
  ];



  return (
    <div className="main">
      <div className="blog-layout mt-lg-responsive">
        <div className="blog-content">
        
          {/* Blog Header (SEO helper) */}
          <BlogHeader
            title="Mindfulness, Wicca, White Magic, Alchemy & Shamanism Blog"
            subtitle=""
            className="mb-lg-responsive"
          />

          {/* Main Article */}
          {mainArticle && (
            <BlogMainArticle item={mainArticle} />
          )}

          

          {/* Banner 1 */}
          <BlogBanner
            title="Intentioned Apparel"
            className='mb-lg-responsive'
            subtitle="Wear your protection. Embody your abundance."
            ctaLabel="SHOP NOW!"
            href="/shop/apparel"
            imageUrl="https://placehold.co/270x180"
          />

          {/* Block 1 (no section title or CTA) */}
          {block1.length > 0 && (
            <BlogGrid
            items={block1}
            className='mb-lg-responsive'
            />
          )}

          

          {/* Banner 2 */}
          <BlogBanner
            title="Manifestation Audibles"
            className='mb-lg-responsive'
            subtitle="Guided meditations and subliminal audios."
            ctaLabel="LISTEN"
            href="/shop/audios"
            imageUrl="https://placehold.co/270x180"
            isAffilliated={true}
          />

          {/* Block 2 */}
          {block2.length > 0 && (
            <BlogGrid items={block2} 
            className='mb-lg-responsive'
            ctaHref="/blog"
            ctaLabel="Check All Blog Posts"
            />
          )}

          
        </div>

        {/* Sidebar with titles, posts, and banners */}
        <BlogSidebar
          sections={[
            { title: 'Top Reads', items: remaining.slice(0, 3) },
            { title: 'Mysticysm 101', items: remaining.slice(3,6) },
          ]}
          banners={sampleBanners} 
          
        />
       
      </div>
    </div>
  );
}
