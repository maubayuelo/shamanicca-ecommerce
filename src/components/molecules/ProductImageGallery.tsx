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
                  <div className="badge badge--sale" aria-label="On sale">
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
          className="nav nav--prev"
          onClick={goPrev}
          aria-label="Previous image"
          disabled={active === 0}
        >
          ‹
        </button>
        <button
          type="button"
          className="nav nav--next"
          onClick={goNext}
          aria-label="Next image"
          disabled={active === imgs.length - 1}
        >
          ›
        </button>
      </div>

      {/* Thumbnails */}
      <div className="gallery__thumbs" role="tablist" aria-label="Image thumbnails">
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
        <div className="gallery__modal" role="dialog" aria-modal="true" aria-label="Fullscreen image viewer">
          <button className="modal__backdrop" onClick={() => setModalOpen(false)} aria-label="Close viewer" />
          <div className="modal__content">
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

      <style jsx>{`
        .product-image-gallery { position: relative; }
        .gallery__viewport {
          position: relative;
          overflow: hidden; /* arrows overlay */
        }
        .gallery__track {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        .gallery__track::-webkit-scrollbar { display: none; }
        .gallery__slide {
          min-width: 100%;
          scroll-snap-align: start;
        }
        .gallery__image-wrapper { position: relative; }
        .image-button { padding: 0; border: 0; background: none; cursor: zoom-in; display: block; width: 100%; }
        .image-button :global(img) { width: 100%; height: auto; display: block; }
        .badge.badge--sale {
          position: absolute;
          top: 12px; left: 12px;
          background: #e11d48; /* rose-600 */
          color: #fff; font-weight: 700; letter-spacing: 0.04em;
          padding: 6px 10px; border-radius: 4px;
          z-index: 2;
        }

        .nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 38px; height: 38px; border-radius: 999px;
          border: none; background: rgba(0,0,0,0.45); color: #fff;
          display: none; align-items: center; justify-content: center;
          cursor: pointer; z-index: 3;
        }
        .nav:disabled { opacity: 0.4; cursor: default; }
        .nav--prev { left: 8px; }
        .nav--next { right: 8px; }
        @media (min-width: 768px) { .nav { display: inline-flex; } }

        .gallery__thumbs {
          margin-top: 10px;
          display: grid; grid-auto-flow: column; grid-auto-columns: max-content; gap: 8px;
          overflow-x: auto; padding-bottom: 4px;
        }
        .thumb { border: 2px solid transparent; border-radius: 6px; padding: 0; background: none; cursor: pointer; }
        .thumb.is-active { border-color: #111; }
        .thumb :global(img) { width: 64px; height: 64px; object-fit: cover; border-radius: 4px; display: block; }

        /* Modal */
        .gallery__modal { position: fixed; inset: 0; z-index: 50; }
        .modal__backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.7); width: 100%; height: 100%; border: 0; }
        .modal__content { position: absolute; inset: 0; display: grid; grid-template-rows: auto 1fr auto; }
        .modal__close { position: absolute; top: 14px; right: 14px; background: rgba(0,0,0,0.6); color: #fff; border: 0; border-radius: 999px; width: 36px; height: 36px; cursor: pointer; z-index: 2; }
        .modal__image { display: grid; place-items: center; padding: 20px; }
        .modal__image :global(img) { max-width: 95vw; max-height: 70vh; width: auto; height: auto; }
        .modal__thumbs { display: grid; grid-auto-flow: column; gap: 8px; padding: 10px 16px 16px; overflow-x: auto; background: rgba(0,0,0,0.15); }
        .modal__thumbs .thumb { border-color: rgba(255,255,255,0.7); }
        .modal__thumbs .thumb.is-active { border-color: #fff; }
      `}</style>
    </section>
  );
}
