import React from 'react';
// Using a native img for easier responsive sizing

export type BlogBannerProps = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
  imageUrl: string;
  className?: string;
  isAffilliated?: boolean;
};

export default function BlogBanner({ title, subtitle, ctaLabel, href = '#', imageUrl, className = '', isAffilliated = false }: BlogBannerProps) {
  return (
    <a href={href} className={`blog-banner${isAffilliated ? ' is-affilliated' : ''} ${className}`}>
      <div className="blog-banner__image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={title} />
      </div>
      <div className="blog-banner__body">
        <div className="blog-banner__title type-2xl type-extrabold">{title}</div>
        {subtitle && <div className="blog-banner__subtitle type-sm mb-0">{subtitle}</div>}
        {isAffilliated && (
          <div className="type-xs mt-0 type-italic" aria-label="Affiliated">Affilliated Ad</div>
        )}
      </div>
      {ctaLabel && (
        <div className="btn btn-primary mb-sm-responsive">{ctaLabel}</div>
      )}
    </a>
  );
}
