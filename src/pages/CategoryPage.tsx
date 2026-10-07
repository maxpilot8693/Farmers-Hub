import React, { useEffect, useState } from 'react';
import { Category, Listing } from '../types';
import { api } from '../lib/api';
import { ListingCard } from '../components/marketplace/ListingCard';
import { ContactFarmerModal } from '../components/marketplace/ContactFarmerModal';
import { ArrowLeft, Sprout } from 'lucide-react';

interface CategoryPageProps {
  slug: string;
  navigate: (route: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ slug, navigate }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [contactModalData, setContactModalData] = useState<{
    listing: Listing;
    farmer: any;
  } | null>(null);

  useEffect(() => {
    async function loadCategoryData() {
      setIsLoading(true);
      try {
        const cat = await api.getCategoryBySlug(slug);
        setCategory(cat);
        const resultListings = await api.getListings({ categorySlug: slug });
        setListings(resultListings);
      } catch (err) {
        console.error('Failed to load category:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategoryData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-10 h-10 border-4 border-[#0D3B2E] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <Sprout className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Category Not Found</h2>
        <button
          onClick={() => navigate('/categories')}
          className="bg-[#0D3B2E] text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          View All Categories
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Back button */}
        <button
          onClick={() => navigate('/categories')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D3B2E] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Categories</span>
        </button>

        {/* Category Header */}
        <div className="bg-[#0D3B2E] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-[#E2C37A] uppercase tracking-wider">
              Agricultural Category
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">{category.name}</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {category.description}
            </p>
            <div className="pt-2 text-xs text-[#E2C37A] font-semibold">
              {listings.length} Active {listings.length === 1 ? 'Listing' : 'Listings'} Available
            </div>
          </div>
        </div>

        {/* Category Listings Grid */}
        {listings.length > 0 ? (
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
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3 max-w-md mx-auto my-8">
            <Sprout className="w-10 h-10 text-emerald-700 mx-auto opacity-60" />
            <h3 className="text-base font-bold text-slate-800">No listings in {category.name} yet</h3>
            <p className="text-xs text-slate-500">Are you a farmer with produce in this category?</p>
            <button
              onClick={() => navigate('/farmer/listings/new')}
              className="bg-[#0D3B2E] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              + Create First Listing
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
