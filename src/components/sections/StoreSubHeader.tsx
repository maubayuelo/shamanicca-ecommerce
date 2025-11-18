import React from 'react';
import Image from 'next/image';

type Props = {
  title: string; // e.g., "Women", "Men", "Accessories"
  onFilterClick?: () => void;
  onSortClick?: () => void;
};

/**
 * Category Subheader matching Figma: centered title + filter/sort bar with borders
 * Non-functional controls for now; wire to state handlers later.
 */
export default function StoreSubHeader({ title, onFilterClick, onSortClick }: Props) {
  return (
    <header className="store-subheader main">
      <div className="store-subheader__title">
        <h1 className="type-3xl type-bold md:type-4xl lg:type-5xl m-0">{title}</h1>
        <p className="m-0">Jackets</p>
        {/* {DisplaySubCategory && (
          <p className="store-subheader__description">{DisplaySubCategory}</p>
        )} */}
      </div>

      <div className="store-subheader__toolbar">
        <div className="store-subheader__left">
          <button type="button" className="toolbar-btn" onClick={onFilterClick} aria-label="Open filters">
            <Image className="toolbar-icon" src="/images/icons/icon-equalizer.svg" alt="" aria-hidden width={20} height={20} />
            <span className="toolbar-label">Filter</span>
          </button>
        </div>
        <div className="store-subheader__right">
          <button type="button" className="toolbar-btn" onClick={onSortClick} aria-label="Open sort options">
            <span className="toolbar-label">Sort</span>
            <Image className="toolbar-caret" src="/images/icons/icon-chevron-down.svg" alt="" aria-hidden width={20} height={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
