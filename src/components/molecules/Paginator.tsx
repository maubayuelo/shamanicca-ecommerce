import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export type PaginatorProps = {
  /** 1-based current page */
  currentPage: number;
  /** total number of items */
  totalItems: number;
  /** items per page */
  pageSize: number;
  /** called when user selects a page (used for client state) */
  onPageChange?: (page: number) => void;
  /** if provided, pages will be rendered as Links using this href builder */
  hrefBuilder?: (page: number) => string;
  /** number of page siblings around the current page */
  siblingCount?: number;
  /** number of start/end boundary pages always shown */
  boundaryCount?: number;
  className?: string;
};

/**
 * Responsive, accessible paginator component.
 * - Renders page numbers with ellipses when needed
 * - Supports either callback navigation or Link-based navigation
 */
export default function Paginator({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  hrefBuilder,
  siblingCount = 1,
  boundaryCount = 1,
  className = '',
}: PaginatorProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Clamp current page into valid range
  const page = Math.max(1, Math.min(currentPage, totalPages));

  // Make sibling/boundary counts responsive to viewport after mount (SSR-safe)
  const { effectiveSiblingCount, effectiveBoundaryCount } = useResponsiveCounts({
    siblingCount,
    boundaryCount,
  });

  const items = React.useMemo(
    () =>
      buildPageItems({
        totalPages,
        currentPage: page,
        siblingCount: effectiveSiblingCount,
        boundaryCount: effectiveBoundaryCount,
      }),
    [totalPages, page, effectiveSiblingCount, effectiveBoundaryCount]
  );

  const handleClick = (p: number) => (e: React.MouseEvent) => {
    if (!hrefBuilder) e.preventDefault();
    if (p === page) return; // no-op
    onPageChange?.(p);
  };

  const goPrev = Math.max(1, page - 1);
  const goNext = Math.min(totalPages, page + 1);
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav className={`paginator ${className}`} aria-label="Pagination" role="navigation">
      <ul className="paginator__list" role="list">
        {/* Prev */}
        <li className={`paginator__item mb-0 paginator__prev${prevDisabled ? ' is-disabled' : ''}`}>
          {hrefBuilder ? (
            <Link aria-disabled={prevDisabled} tabIndex={prevDisabled ? -1 : 0} href={hrefBuilder(goPrev)} onClick={prevDisabled ? undefined : handleClick(goPrev)} aria-label="Previous page">
              <Image src="/images/icons/icon-chevron-left.svg" alt="" aria-hidden width={12} height={21} />
              <span className="sr-only">Previous</span>
            </Link>
          ) : (
            <button type="button" aria-label="Previous" disabled={prevDisabled} onClick={handleClick(goPrev)}>
              <Image src="/images/icons/icon-chevron-left.svg" alt="" aria-hidden width={12} height={21} />
            </button>
          )}
        </li>

        {/* Page numbers */}
        {items.map((item, idx) => {
          if (item.type === 'dots') {
            return (
              <li key={`dots-${idx}`} className="paginator__item mb-0 is-ellipsis" aria-hidden>
                <span className="type-lg type-medium">…</span>
              </li>
            );
          }
          const isActive = item.page === page;
          const content = (
            <>
              <span className="sr-only">Page </span>
              <span className="type-lg type-extrabold">{item.page}</span>
            </>
          );
          return (
            <li key={item.page} className={`paginator__item mb-0${isActive ? ' is-active' : ''}`} aria-current={isActive ? 'page' : undefined}>
              {hrefBuilder ? (
                <Link href={hrefBuilder(item.page)} aria-label={`Go to page ${item.page}`} onClick={handleClick(item.page)}>
                  {content}
                </Link>
              ) : (
                <button type="button" aria-label={`Go to page ${item.page}`} onClick={handleClick(item.page)} disabled={isActive}>
                  {content}
                </button>
              )}
            </li>
          );
        })}

        {/* Next */}
        <li className={`paginator__item mb-0 paginator__next${nextDisabled ? ' is-disabled' : ''}`}>
          {hrefBuilder ? (
            <Link aria-disabled={nextDisabled} tabIndex={nextDisabled ? -1 : 0} href={hrefBuilder(goNext)} onClick={nextDisabled ? undefined : handleClick(goNext)} aria-label="Next page">
              <Image src="/images/icons/icon-chevron-right.svg" alt="" aria-hidden width={12} height={21} />
              <span className="sr-only">Next</span>
            </Link>
          ) : (
            <button type="button" aria-label="Next" disabled={nextDisabled} onClick={handleClick(goNext)}>
              <Image src="/images/icons/icon-chevron-right.svg" alt="" aria-hidden width={12} height={21} />
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

// Helpers

type PageItem = { type: 'page'; page: number } | { type: 'dots' };

function buildPageItems({
  totalPages,
  currentPage,
  siblingCount,
  boundaryCount,
}: {
  totalPages: number;
  currentPage: number;
  siblingCount: number;
  boundaryCount: number;
}): PageItem[] {
  const items: PageItem[] = [];
  if (totalPages <= 1) return [{ type: 'page', page: 1 }];

  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

  const leftSiblingStart = Math.max(
    Math.min(currentPage - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );
  const rightSiblingEnd = Math.min(
    Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
  );

  // Start pages
  startPages.forEach((p) => items.push({ type: 'page', page: p }));

  // Left dots
  if (leftSiblingStart > boundaryCount + 2) {
    items.push({ type: 'dots' });
  } else if (boundaryCount + 1 < totalPages - boundaryCount) {
    items.push({ type: 'page', page: boundaryCount + 1 });
  }

  // Middle pages
  for (let p = leftSiblingStart; p <= rightSiblingEnd; p++) {
    items.push({ type: 'page', page: p });
  }

  // Right dots
  if (rightSiblingEnd < totalPages - boundaryCount - 1) {
    items.push({ type: 'dots' });
  } else if (totalPages - boundaryCount > boundaryCount) {
    items.push({ type: 'page', page: totalPages - boundaryCount });
  }

  // End pages
  endPages.forEach((p) => items.push({ type: 'page', page: p }));

  // Deduplicate while preserving order
  const seen = new Set<number>();
  const final: PageItem[] = [];
  for (const it of items) {
    if (it.type === 'dots') {
      if (final[final.length - 1]?.type !== 'dots') final.push(it);
    } else if (!seen.has(it.page)) {
      seen.add(it.page);
      final.push(it);
    }
  }
  return final;
}

function range(start: number, end: number): number[] {
  if (end < start) return [];
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

// Screen-reader only utility if not already present in the design system
// This is a defensive style—actual class is styled in global CSS.
export const __SR_ONLY_CLASS = 'sr-only';

// --- Internals: responsive counts

function useResponsiveCounts({
  siblingCount,
  boundaryCount,
}: {
  siblingCount: number;
  boundaryCount: number;
}): { effectiveSiblingCount: number; effectiveBoundaryCount: number } {
  const [counts, setCounts] = React.useState({
    effectiveSiblingCount: siblingCount,
    effectiveBoundaryCount: boundaryCount,
  });

  React.useEffect(() => {
    // Keep in-sync with SCSS breakpoints from variables.scss
    const PHONE_MAX = 600; // $breakpoint-phone
    const DESKTOP_MIN = 1024; // $breakpoint-desktop

    const compute = () => {
      const w = window.innerWidth || DESKTOP_MIN;
      if (w <= PHONE_MAX) {
        return { effectiveSiblingCount: Math.min(0, siblingCount), effectiveBoundaryCount: Math.min(1, boundaryCount) };
      }
      if (w < DESKTOP_MIN) {
        return { effectiveSiblingCount: Math.max(1, siblingCount), effectiveBoundaryCount: Math.max(1, boundaryCount) };
      }
      // Desktop and up
      return { effectiveSiblingCount: Math.max(2, siblingCount), effectiveBoundaryCount: Math.max(2, boundaryCount) };
    };

    const next = compute();
    setCounts(next);
    const onResize = () => setCounts(compute());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [siblingCount, boundaryCount]);

  return counts;
}
