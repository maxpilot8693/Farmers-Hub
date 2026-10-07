import React from 'react';
import { FilterOptions } from '../../types';
import { KENYA_COUNTIES } from '../../data/kenyaCounties';
import { Search, MapPin, Filter, X, SlidersHorizontal } from 'lucide-react';

interface SearchFilterBarProps {
  filters: FilterOptions;
  categories: { name: string; slug: string }[];
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filters,
  categories,
  onFilterChange,
  onClearFilters,
}) => {
  const selectedCountyObj = KENYA_COUNTIES.find((c) => c.name === filters.county);
  const subCounties = selectedCountyObj ? selectedCountyObj.subCounties : [];

  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    Boolean(filters.categorySlug) ||
    Boolean(filters.county) ||
    Boolean(filters.subCounty) ||
    Boolean(filters.onlyVerified) ||
    Boolean(filters.onlyAvailable) ||
    Boolean(filters.sortBy);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        {/* Text Search */}
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search produce, livestock, equipment, or farm services..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#0D3B2E] focus:outline-none transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="w-full sm:w-56">
          <select
            value={filters.categorySlug || ''}
            onChange={(e) => onFilterChange({ categorySlug: e.target.value || undefined })}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#0D3B2E] focus:outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="w-full sm:w-48">
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#0D3B2E] focus:outline-none cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Secondary Location & Verification Filters */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* County Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-semibold text-slate-600">County:</span>
            <select
              value={filters.county || ''}
              onChange={(e) =>
                onFilterChange({ county: e.target.value || undefined, subCounty: undefined })
              }
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="">All Kenya</option>
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-county Selector */}
          {selectedCountyObj && (
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-600">Sub-County:</span>
              <select
                value={filters.subCounty || ''}
                onChange={(e) => onFilterChange({ subCounty: e.target.value || undefined })}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="">All {filters.county}</option>
                {subCounties.map((sc) => (
                  <option key={sc.name} value={sc.name}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Checkboxes */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none px-2 py-1 bg-emerald-50 rounded-lg text-emerald-900 border border-emerald-200 font-medium">
            <input
              type="checkbox"
              checked={filters.onlyVerified || false}
              onChange={(e) => onFilterChange({ onlyVerified: e.target.checked })}
              className="rounded text-[#0D3B2E] focus:ring-[#0D3B2E]"
            />
            <span>Verified Farmers Only</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none px-2 py-1 bg-slate-50 rounded-lg text-slate-700 border border-slate-200 font-medium">
            <input
              type="checkbox"
              checked={filters.onlyAvailable || false}
              onChange={(e) => onFilterChange({ onlyAvailable: e.target.checked })}
              className="rounded text-[#0D3B2E] focus:ring-[#0D3B2E]"
            />
            <span>In Stock / Available Now</span>
          </label>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 py-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
