import React from 'react';

export type ProductFilterValues = {
  categories: string[];
  priceRanges: string[]; // e.g., '<25', '25-50', '50-100', '>100'
};

export type ProductFilterPanelProps = {
  isOpen: boolean;
  onClose?: () => void;
  onApply?: (values: ProductFilterValues) => void;
  className?: string;
};

const defaultValues: ProductFilterValues = {
  categories: [],
  priceRanges: [],
};

export default function ProductFilterPanel({ isOpen, onClose, onApply, className = '' }: ProductFilterPanelProps) {
  const [values, setValues] = React.useState<ProductFilterValues>(defaultValues);

  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const toggle = (group: keyof ProductFilterValues, key: string) => {
    setValues((prev) => {
      const set = new Set(prev[group]);
      if (set.has(key)) set.delete(key); else set.add(key);
      return { ...prev, [group]: Array.from(set) };
    });
  };

  const handleApply = () => {
    onApply?.(values);
    onClose?.();
  };

  const handleClear = () => {
    setValues(defaultValues);
  };

  return (
    <div className={`product-filter ${isOpen ? 'is-open' : ''} ${className}`} role="dialog" aria-modal="true" aria-labelledby="product-filter-title">
      <div className="product-filter__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="product-filter__inner pt-sm-responsive pb-md-responsive">
        <div className="product-filter__header">
          <h2 id="product-filter-title" className="type-md type-extrabold m-0 type-uppercase">Filters</h2>
          <button className="product-filter__close" aria-label="Close filters" onClick={onClose}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icon-close.svg" alt="" aria-hidden="true" />
            <span className="visually-hidden">Close</span>
          </button>
        </div>

        <div className="product-filter__grid">
          <fieldset className="product-filter__group">
            <legend className="type-bold">Category</legend>
            <label className="product-filter__check"><input type="checkbox" onChange={() => toggle('categories', 'apparel')} /> Apparel</label>
            <label className="product-filter__check"><input type="checkbox" onChange={() => toggle('categories', 'audibles')} /> Audibles</label>
            <label className="product-filter__check"><input type="checkbox" onChange={() => toggle('categories', 'accessories')} /> Accessories</label>
          </fieldset>

          <fieldset className="product-filter__group">
            <legend className="type-bold">Price</legend>
            <label className="product-filter__check"><input type="checkbox" onChange={() => toggle('priceRanges', '<25')} /> Under $25</label>
            <label className="product-filter__check"><input type="checkbox" onChange={() => toggle('priceRanges', '25-50')} /> $25 – $50</label>
            <label className="product-filter__check"><input type="checkbox" onChange={() => toggle('priceRanges', '50-100')} /> $50 – $100</label>
            <label className="product-filter__check"><input type="checkbox" onChange={() => toggle('priceRanges', '>100')} /> Over $100</label>
          </fieldset>
        </div>

        <div className="product-filter__actions mt-md-responsive">
          <button className="btn btn-secondary btn-small" onClick={handleClear}>Clear</button>
          <button className="btn btn-primary btn-small" onClick={handleApply}>Apply</button>
        </div>
      </div>
    </div>
  );
}
