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
    <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-5">
      <h3 className="font-semibold text-gray-900">Filter</h3>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => update({ category: undefined })}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              !filters.category
                ? 'bg-black text-white border-black'
                : 'text-neutral-600 border-neutral-300 hover:border-black'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => update({ category: cat as Filters['category'] })}
              className={`px-3 py-1 rounded-full text-xs border capitalize transition-colors ${
                filters.category === cat
                  ? 'bg-black text-white border-black'
                  : 'text-neutral-600 border-neutral-300 hover:border-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
          Daily Rate
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min $"
            value={filters.minPrice ?? ''}
            onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full border border-neutral-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span className="text-neutral-400">—</span>
          <input
            type="number"
            placeholder="Max $"
            value={filters.maxPrice ?? ''}
            onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full border border-neutral-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="available"
          checked={filters.available === true}
          onChange={(e) => update({ available: e.target.checked ? true : undefined })}
          className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black"
        />
        <label htmlFor="available" className="text-sm text-gray-700">
          Available only
        </label>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({})}
        className="text-xs text-neutral-500 hover:text-black underline"
      >
        Clear filters
      </button>
    </div>
  );
}
