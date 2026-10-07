import React, { useEffect, useState } from 'react';
import { Category, FilterOptions, Listing } from '../types';
import { api } from '../lib/api';
import { ListingCard } from '../components/marketplace/ListingCard';
import { SearchFilterBar } from '../components/marketplace/SearchFilterBar';
import { ContactFarmerModal } from '../components/marketplace/ContactFarmerModal';
import { Sprout, Filter, AlertCircle } from 'lucide-react';

interface SearchPageProps {
  navigate: (route: string) => void;
  initialQuery?: string;
  initialCounty?: string;
  initialCategory?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  navigate,
  initialQuery = '',
  initialCounty = '',
  initialCategory = '',
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: initialQuery,
    county: initialCounty || undefined,
    categorySlug: initialCategory || undefined,
    sortBy: 'newest',
  });

  const [contactModalData, setContactModalData] = useState<{
    listing: Listing;
    farmer: any;
  } | null>(null);

  // Sync state if URL query params change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: initialQuery,
      county: initialCounty || undefined,
      categorySlug: initialCategory || undefined,
    }));
  }, [initialQuery, initialCounty, initialCategory]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [cats, resultListings] = await Promise.all([
          api.getCategories(),
          api.getListings(filters),
        ]);
        setCategories(cats);
        setListings(resultListings);
      } catch (err) {
        console.error('Search fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [filters]);

  const handleFilterChange = (updates: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      categorySlug: undefined,
      county: undefined,
      subCounty: undefined,
      onlyVerified: false,
      onlyAvailable: false,
      sortBy: 'newest',
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
              Agricultural Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse produce, livestock, seeds, equipment and agricultural services across Kenya.
            </p>
          </div>
          <span className="text-xs font-bold text-[#0D3B2E] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            {listings.length} {listings.length === 1 ? 'Listing' : 'Listings'} Found
          </span>
        </div>

        {/* Filter Controls Bar */}
        <SearchFilterBar
          filters={filters}
          categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Category Filter Pills (Functional Filter Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleFilterChange({ categorySlug: undefined })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              !filters.categorySlug
                ? 'bg-[#0D3B2E] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilterChange({ categorySlug: cat.slug })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                filters.categorySlug === cat.slug
                  ? 'bg-[#0D3B2E] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.name} ({cat.listing_count})
            </button>
          ))}
        </div>

        {/* Listings Result Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-slate-200"></div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                navigate={navigate}
                onContactClick={(l) => {
                  if (l.farmer) setContactModalData({ listing: l, farmer: l.farmer });
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4 max-w-lg mx-auto my-8">
            <Sprout className="w-12 h-12 text-emerald-700 mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-slate-900">No agricultural listings match your search</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Try adjusting your search keywords, clearing county location filters, or browsing other agricultural categories.
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-[#0D3B2E] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#16503f] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* CONTACT MODAL */}
      {contactModalData && (
        <ContactFarmerModal
          listing={contactModalData.listing}
          farmer={contactModalData.farmer}
          isOpen={Boolean(contactModalData)}
          onClose={() => setContactModalData(null)}
        />
      )}
    </div>
  );
};
