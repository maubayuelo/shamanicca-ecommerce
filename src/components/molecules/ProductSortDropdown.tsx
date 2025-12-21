import React from 'react';

export type SortOption = {
  value: string;
  label: string;
};

export type ProductSortDropdownProps = {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  options?: SortOption[];
};

const defaultOptions: SortOption[] = [
  { value: 'recent', label: 'Recent' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'rating-high', label: 'Best Rated' },
];

export default function ProductSortDropdown({ value = 'recent', onChange, className = '', options = defaultOptions }: ProductSortDropdownProps) {
  return (
    <div className={`product-sort ${className}`}>
      <label htmlFor="product-sort" className="visually-hidden">Sort products</label>
      <select
        id="product-sort"
        name="product-sort"
        className="form-control form-control--condensed product-sort__select"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label="Sort products"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
