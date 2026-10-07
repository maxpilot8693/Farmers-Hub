import React, { useEffect, useState } from 'react';
import { Category, Listing } from '../types';
import { api } from '../lib/api';
import { HeroSection } from '../components/marketplace/HeroSection';
import { CategoryGrid } from '../components/marketplace/CategoryGrid';
import { ListingCard } from '../components/marketplace/ListingCard';
import { SafetyTipsCard } from '../components/marketplace/SafetyTipsCard';
import { ContactFarmerModal } from '../components/marketplace/ContactFarmerModal';
import { ArrowRight, Sparkles, Sprout, PlusCircle, Store } from 'lucide-react';

interface HomePageProps {
  navigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [freshListings, setFreshListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Contact Modal State
  const [contactModalData, setContactModalData] = useState<{
    listing: Listing;
    farmer: any;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [cats, listings] = await Promise.all([
          api.getCategories(),
          api.getListings({ sortBy: 'newest' }),
        ]);
        setCategories(cats);
        setFreshListings(listings.slice(0, 8)); // Top 8 fresh listings
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearch = (query: string, county: string) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (county) params.set('county', county);
    navigate(`/search?${params.toString()}`);
  };

  const handleOpenContactModal = (listing: Listing) => {
    if (listing.farmer) {
      setContactModalData({ listing, farmer: listing.farmer });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8] text-slate-800 space-y-10 pb-16">
      {/* 1. HERO DISCOVERY SECTION */}
      <HeroSection onSearch={handleHeroSearch} navigate={navigate} />

      {/* 2. BROWSE AGRICULTURE CATEGORIES */}
      <CategoryGrid
        categories={categories}
        onSelectCategory={(slug) => navigate(`/category/${slug}`)}
      />

      {/* 3. FRESH LISTINGS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0D3B2E] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#E2C37A]" />
              <span>Direct Farm Marketplace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0D3B2E]">
              Fresh Agricultural Listings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Recently published produce, livestock, seedlings and farming services from verified Kenyan farmers.
            </p>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="text-xs font-bold text-[#0D3B2E] hover:text-[#16503f] flex items-center gap-1.5 py-1 px-3 bg-emerald-50 border border-emerald-200/80 rounded-xl hover:bg-emerald-100/80 transition-colors shrink-0"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-slate-200"></div>
            ))}
          </div>
        ) : freshListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freshListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                navigate={navigate}
                onContactClick={handleOpenContactModal}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Sprout className="w-12 h-12 text-emerald-700 mx-auto opacity-60" />
            <h3 className="text-lg font-bold text-slate-800">No active listings available</h3>
            <p className="text-xs text-slate-500">Be the first farmer to list your agricultural produce!</p>
            <button
              onClick={() => navigate('/farmer/listings/new')}
              className="bg-[#0D3B2E] text-white px-5 py-2 rounded-xl text-xs font-bold"
            >
              + List Your Produce
            </button>
          </div>
        )}
      </section>

      {/* 4. LIST YOUR FARM PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0D3B2E] via-[#154d3e] to-[#0D3B2E] rounded-3xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#E2C37A] text-[#0D3B2E] text-xs font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
              <Store className="w-4 h-4" />
              <span>For Smallholder Farmers & Agri-Businesses</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">
              Are you a farmer in Kenya with produce, livestock or services to sell?
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              Create your digital farm profile on FarmersHub in minutes. Publish listings for your avocados, milk, maize, cattle, seedlings or tractor services and let buyers across Kenya contact you directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => navigate('/register?type=farmer')}
              className="bg-[#E2C37A] hover:bg-[#d5b56a] text-[#0D3B2E] font-bold px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
              <span>List Your Farm Now</span>
            </button>
            <button
              onClick={() => navigate('/search')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-sm border border-white/30 text-center transition-all"
            >
              Explore Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* 5. SAFETY & MARKETPLACE GUIDANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SafetyTipsCard />
      </section>

      {/* CONTACT FARMER MODAL */}
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
