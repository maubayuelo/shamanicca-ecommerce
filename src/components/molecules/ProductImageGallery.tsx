import React from 'react';

type GalleryImage = {
  src: string;
  alt?: string;
  thumb?: string;
  // Optional additional <source> entries for <picture>
  sources?: Array<{
    srcSet: string;
    type: string;
    media?: string;
  }>;
};

export type ProductImageGalleryProps = {
  images?: GalleryImage[];
  title?: string;
  isOnSale?: boolean;
  initialIndex?: number;
  className?: string;
};

// Utility to generate 5 placeholder images with different angles in WebP
function buildPlaceholderSet(title = 'Product'): GalleryImage[] {
  const angles = ['Front', 'Back', 'Side', 'Top', 'Bottom'] as const;
  const sizeLg = 1000;
  const sizeMd = 700;
  const sizeSm = 400;

  return angles.map((label) => {
    const text = encodeURIComponent(`${title} ${label}`);
    const baseWebp = `https://placehold.co/${sizeLg}x${sizeLg}.webp?text=${text}`;
    const basePng = `https://placehold.co/${sizeLg}x${sizeLg}.png?text=${text}`;
    const thumb = `https://placehold.co/160x160.webp?text=${encodeURIComponent(label)}`;

    const srcSetWebp = [
      `https://placehold.co/${sizeSm}x${sizeSm}.webp?text=${text} ${sizeSm}w`,
      `https://placehold.co/${sizeMd}x${sizeMd}.webp?text=${text} ${sizeMd}w`,
      `${baseWebp} ${sizeLg}w`,
    ].join(', ');
    const srcSetPng = [
      `https://placehold.co/${sizeSm}x${sizeSm}.png?text=${text} ${sizeSm}w`,
      `https://placehold.co/${sizeMd}x${sizeMd}.png?text=${text} ${sizeMd}w`,
      `${basePng} ${sizeLg}w`,
    ].join(', ');

    return {
      src: basePng,
      thumb,
      alt: `${title} — ${label}`,
      sources: [
        { srcSet: srcSetWebp, type: 'image/webp' },
        { srcSet: srcSetPng, type: 'image/png' },
      ],
    };
  });
}

export default function ProductImageGallery({
  images,
  title = 'Product',
  isOnSale,
  initialIndex = 0,
  className,
}: ProductImageGalleryProps) {
  const imgs = React.useMemo(() => (images && images.length > 0 ? images : buildPlaceholderSet(title)), [images, title]);
  const [active, setActive] = React.useState(Math.min(Math.max(0, initialIndex), imgs.length - 1));
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const slideRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [isModalOpen, setModalOpen] = React.useState(false);

  // Keep active index in sync with scroll position
  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onScroll = () => {
      const { scrollLeft, clientWidth } = viewport;
      const i = Math.round(scrollLeft / clientWidth);
      setActive(Math.min(Math.max(0, i), imgs.length - 1));
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });
    return () => viewport.removeEventListener('scroll', onScroll);
  }, [imgs.length]);

  // Scroll to active when thumbnails/arrows change it
  const scrollToIndex = (idx: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const clamped = Math.min(Math.max(0, idx), imgs.length - 1);
    const slide = slideRefs.current[clamped];
    if (slide) slide.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  const goPrev = () => scrollToIndex(active - 1);
  const goNext = () => scrollToIndex(active + 1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section
      className={["product-image-gallery", className].filter(Boolean).join(' ')}
      aria-label="Product image gallery"
    >
      <div className="gallery__viewport" ref={viewportRef} onKeyDown={handleKeyDown} tabIndex={0}>
        <div className="gallery__track">
          {imgs.map((img, i) => (
            <div
              key={i}
              className="gallery__slide"
              ref={(el) => { slideRefs.current[i] = el; }}
            >
              <div className="gallery__image-wrapper">
                {isOnSale && (
                  <div className="badge badge--sale type-bold" aria-label="On sale">
                    <span>SALE</span>
                  </div>
                )}
                <button
                  type="button"
                  className="image-button"
                  onClick={() => setModalOpen(true)}
                  aria-label={`Open fullscreen view for image ${i + 1}`}
                >
                  <picture>
                    {img.sources?.map((s, idx) => (
                      <source key={idx} srcSet={s.srcSet} type={s.type} media={s.media} />
                    ))}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.alt || title}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </picture>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows (desktop priority) */}
        <button
          type="button"
          className="nav nav--prev type-extrabold type-xl-responsive"
          onClick={goPrev}
          aria-label="Previous image"
          disabled={active === 0}
        >
          <img src={"/images/icon-chevron-left.svg"} alt="" aria-hidden />
        </button>
        <button
          type="button"
          className="nav nav--next type-extrabold type-xl-responsive"
          onClick={goNext}
          aria-label="Next image"
          disabled={active === imgs.length - 1}
        >
          <img src={"/images/icon-chevron-right.svg"} alt="" aria-hidden />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="gallery__thumbs mt-md-responsive" role="tablist" aria-label="Image thumbnails">
        {imgs.map((img, i) => (
          <button
            type="button"
            key={i}
            className={["thumb", i === active ? 'is-active' : ''].join(' ')}
            role="tab"
            aria-selected={i === active}
            aria-controls={`slide-${i}`}
            onClick={() => {
              setActive(i);
              scrollToIndex(i);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.thumb || img.src} alt={img.alt || `${title} thumbnail ${i + 1}`} />
          </button>
        ))}
      </div>

      {/* Fullscreen modal */}
      {isModalOpen && (
        <div className="gallery__modal " role="dialog" aria-modal="true" aria-label="Fullscreen image viewer">
          <button className="modal__backdrop" onClick={() => setModalOpen(false)} aria-label="Close viewer" />
          <div className="modal__content pt-md-responsive">
            <button className="modal__close" onClick={() => setModalOpen(false)} aria-label="Close">✕</button>
            <div className="modal__image">
              <picture>
                {imgs[active].sources?.map((s, idx) => (
                  <source key={idx} srcSet={s.srcSet} type={s.type} media={s.media} />
                ))}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgs[active].src} alt={imgs[active].alt || title} />
              </picture>
            </div>
            <div className="modal__thumbs">
              {imgs.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  className={["thumb", i === active ? 'is-active' : ''].join(' ')}
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.thumb || img.src} alt={img.alt || `${title} thumbnail ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
