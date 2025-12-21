import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ProductSortDropdown from '../molecules/ProductSortDropdown';
import ProductFilterPanel from '../molecules/ProductFilterPanel';
import { useBodyClass } from '../../utils/dom';

type Props = {
  categoryTitle: string; // e.g., "Women", "Men", "Accessories"
  subCategoryTitle?: string; // optional, shown when a subcategory is active
  onFilterClick?: () => void;
  onSortClick?: () => void;
};

/**
 * Category Subheader matching Figma: centered title + filter/sort bar with borders
 * Non-functional controls for now; wire to state handlers later.
 */
export default function StoreSubHeader({ categoryTitle, subCategoryTitle, onFilterClick, onSortClick }: Props) {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const router = useRouter();

  const handleFilterClick = () => {
    setFilterOpen(true);
    onFilterClick?.();
  };

  const handleApplyFilters = (values: any) => {
    // TODO: bubble up to parent product list to refresh feed
    setFilterOpen(false);
  };

  // Close filter on route change (navigation)
  React.useEffect(() => {
    const closeOnRoute = () => setFilterOpen(false);
    router.events.on('routeChangeStart', closeOnRoute);
    return () => {
      router.events.off('routeChangeStart', closeOnRoute);
    };
  }, [router.events]);

  // Close filter if user interacts with header menus/actions
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('.header__mobile_toggle') ||
        target.closest('.header__nav_item') ||
        target.closest('.header__action_btn')
      ) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Unified: toggle only the marker class, no inline style
  useBodyClass('no-scroll', filterOpen);

  return (
    <header className="store-subheader main pb-lg-responsive">
      <div className="store-subheader__title">
        <h1 className="type-3xl type-bold md:type-4xl lg:type-5xl m-0">{categoryTitle}</h1>
        {subCategoryTitle && (
          <p className="m-0">{subCategoryTitle}</p>
        )}
      </div>

      <div className="store-subheader__toolbar">
        <div className="store-subheader__left">
          <button type="button" className="toolbar-btn" onClick={handleFilterClick} aria-label="Open filters">
            <Image className="toolbar-icon" src="/images/icon-equalizer.svg" alt="" aria-hidden width={20} height={20} />
            <span className="toolbar-label">Filter</span>
          </button>
        </div>
        <div className="store-subheader__right">
          <ProductSortDropdown className="store-subheader__sort" />
        </div>
      </div>

      <ProductFilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </header>
  );
}
