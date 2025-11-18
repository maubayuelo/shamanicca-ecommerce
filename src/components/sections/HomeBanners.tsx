import React from 'react';
import Image from 'next/image';

export type Banner = {
  id: string | number;
  title: string;
  subtitle?: string;
  href?: string;
  imageUrl?: string;
};

type Props = {
  banners: [Banner, Banner];
  className?: string;
};

/**
 * Two side-by-side promotional banners with background image and overlayed text.
 * - Mobile: stacked
 * - Tablet: 2 columns
 * - Desktop: fixed width container
 */
export default function HomeBanners({ banners, className = '' }: Props) {
  return (
    <section className={`section-home-banners main ${className}`}>
      {banners.map((b) => (
        <a
          key={b.id}
          href={b.href || '#'}
          className="banner-card"
          aria-label={b.title}
        >
          {b.imageUrl && (
            <Image
              src={b.imageUrl}
              alt=""
              aria-hidden
              loading="lazy"
              className="banner-card__img"
              width={1000}
              height={800}
            />
          )}
          <div className="content">
            <h3 className="type-4xl type-extrabold type-white m-0">{b.title}</h3>
            {b.subtitle && <p className="type-2xl type-bold type-white m-0">{b.subtitle}</p>}
          </div>
        </a>
      ))}
    </section>
  );
}
