import React from 'react';
import Image from 'next/image';
import BlogBannerSidebar from './BlogBannerSidebar';

import type { BlogGridItem } from './BlogGrid';

type SidebarSection = {
  title: string;
  items: BlogGridItem[];
};

type SidebarBanner = {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
};

type BlogSidebarProps = {
  sections?: SidebarSection[];
  banners?: SidebarBanner[];
  className?: string;
};

export default function BlogSidebar({ sections = [], banners = [], className = '' }: BlogSidebarProps) {
  return (
    <aside className={`blog-sidebar ${className}`}>
      {sections.map((section, idx) => (
        <React.Fragment key={`secfrag-${idx}`}>
          {/* Section */}
          <div className="blog-sidebar__section">
            {idx === Math.floor(sections.length / 2) - 1 && banners[0] && (
              <BlogBannerSidebar
                className="mt-sm-responsive mb-sm-responsive"
                imageUrl={banners[0].imageUrl}
                title={banners[0].title}
                subtitle={banners[0].subtitle}
                ctaLabel={banners[0].ctaLabel}
                href={banners[0].href}
              />
            )}

            <h3 className="type-3xl type-extrabold type-uppercase mt-0">{section.title}</h3>
            <div className="blog-sidebar__list">
              {section.items.map((item) => (
                <article key={item.id} className="blog-sidebar__row">
                  <a href={item.href || '#'} className="blog-sidebar__thumb rounded-30" aria-label={`Read ${item.title}`}>
                    <Image src={item.imageUrl || 'https://placehold.co/180x180.png'} alt="" width={180} height={180} loading="lazy" />
                  </a>
                  <div className="blog-sidebar__info">
                    <h3 className="type-xl type-extrabold m-0"><a href={item.href || '#'}>{item.title}</a></h3>
                    {item.summary && <p className="type-md m-0">{item.summary}</p>}
                  </div>
                </article>
              ))}
            </div>

            {idx === Math.floor(sections.length / 2) - 1 && banners[0] && (
              <BlogBannerSidebar
                className="mt-sm-responsive"
                imageUrl={banners[0].imageUrl}
                title={banners[0].title}
                subtitle={banners[0].subtitle}
                ctaLabel={banners[0].ctaLabel}
                href={banners[0].href}
                isAffilliated={true}
              />
            )}
          </div>


        

          
        </React.Fragment>
      ))}
    </aside>
  );
}