import React from 'react';
import Image from 'next/image';

export type BlogBannerSidebarProps = {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
  className?: string;
  isAffilliated?: boolean;
};

export default function BlogBannerSidebar({
  imageUrl,
  title,
  subtitle,
  ctaLabel,
  href = '#',
  className = '',
  isAffilliated = false
}: BlogBannerSidebarProps) {
  return (
    <a
      href={href}
      className={`blog-sidebar__banner${isAffilliated ? ' is-affilliated' : ''} ${className}`}
      target={isAffilliated ? '_blank' : undefined}
      rel={isAffilliated ? 'noopener noreferrer' : undefined}
    >
      <div className="blog-sidebar__banner-image">
        <Image src={imageUrl} alt={title || ''} width={180} height={180} />
      </div>
      <div className="blog-sidebar__banner-body">
        <div className="flex flex-col gap-[3px]">
          {title && <div className="type-xl type-extrabold">{title}</div>}
          {subtitle && <div className="type-md mb-xm-responsive">{subtitle}</div>}
          {isAffilliated && (
          <div className="type-italic type-xs mt-0" aria-label="Affiliated">Affilliated Ad</div>
        )}
        </div>
        {ctaLabel && (
          <div className="btn btn-primary btn-large self-stretch">
            <span>{ctaLabel}</span>
            {isAffilliated && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/images/icon-external-link.svg" alt="" aria-hidden="true" width={20} height={20} />
            )}
          </div>
        )}
      </div>
    </a>
  );
}
