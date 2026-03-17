'use client';

import { VehicleFilters as Filters } from '@/types/vehicle';

interface VehicleFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const CATEGORIES = ['sports', 'suv', 'sedan', 'convertible', 'coupe'];

export default function VehicleFilters({ filters, onChange }: VehicleFiltersProps) {
  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <div className="luxury-card p-5 space-y-6">
      <h3 className="text-xs font-sans tracking-[0.3em] uppercase text-gold">Filter</h3>

      <div className="h-px bg-gold/10" />

      {/* Category */}
      <div>
        <label className="block text-xs font-sans tracking-[0.2em] uppercase text-neutral-500 mb-3">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => update({ category: undefined })}
            className={`px-3 py-1.5 text-[10px] font-sans tracking-widest uppercase border transition-all duration-200 ${
              !filters.category
                ? 'border-gold text-gold bg-gold/5'
                : 'border-dark-500 text-neutral-600 hover:border-gold/40 hover:text-neutral-400'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => update({ category: cat as Filters['category'] })}
              className={`px-3 py-1.5 text-[10px] font-sans tracking-widest uppercase border capitalize transition-all duration-200 ${
                filters.category === cat
                  ? 'border-gold text-gold bg-gold/5'
                  : 'border-dark-500 text-neutral-600 hover:border-gold/40 hover:text-neutral-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-xs font-sans tracking-[0.2em] uppercase text-neutral-500 mb-3">
          Daily Rate
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min $"
            value={filters.minPrice ?? ''}
            onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full bg-dark-300 border border-dark-500 text-white text-xs font-sans px-3 py-2
                       focus:outline-none focus:border-gold/40 placeholder:text-neutral-700 transition-colors"
          />
          <span className="text-neutral-600 text-xs">—</span>
          <input
            type="number"
            placeholder="Max $"
            value={filters.maxPrice ?? ''}
            onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full bg-dark-300 border border-dark-500 text-white text-xs font-sans px-3 py-2
                       focus:outline-none focus:border-gold/40 placeholder:text-neutral-700 transition-colors"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="available"
          checked={filters.available === true}
          onChange={(e) => update({ available: e.target.checked ? true : undefined })}
          className="h-3.5 w-3.5 border border-dark-500 bg-dark-300 accent-gold"
        />
        <label htmlFor="available" className="text-xs font-sans tracking-widest uppercase text-neutral-500 cursor-pointer">
          Available Only
        </label>
      </div>

      <div className="h-px bg-gold/10" />

      <button
        onClick={() => onChange({})}
        className="text-[10px] font-sans tracking-widest uppercase text-neutral-600 hover:text-gold transition-colors duration-200"
      >
        Clear Filters
      </button>
    </div>
  );
}
