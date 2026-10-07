import React, { useEffect, useState } from 'react';
import { Listing } from '../types';
import { api } from '../lib/api';
import { ListingCard } from '../components/marketplace/ListingCard';
import { ContactFarmerModal } from '../components/marketplace/ContactFarmerModal';
import { Heart, Sprout } from 'lucide-react';

interface FavoritesPageProps {
  navigate: (route: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ navigate }) => {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [contactModalData, setContactModalData] = useState<{
    listing: Listing;
    farmer: any;
  } | null>(null);

  useEffect(() => {
    async function loadFavorites() {
      setIsLoading(true);
      try {
        const favs = await api.getFavorites();
        setFavorites(favs);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFavorites();
  }, []);

  const handleFavoriteToggle = async (listingId: string) => {
    await api.toggleFavorite(listingId);
    setFavorites((prev) => prev.filter((l) => l.id !== listingId));
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#0D3B2E]">Saved Agricultural Listings</h1>
            <p className="text-xs text-slate-500">Your bookmarked produce, livestock, and farm services.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-slate-200"></div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                navigate={navigate}
                onContactClick={(l) => {
                  if (l.farmer) setContactModalData({ listing: l, farmer: l.farmer });
                }}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3 max-w-md mx-auto my-8">
            <Heart className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">You haven't saved any listings yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When browsing the marketplace, click the heart icon on any listing to save it here for quick access.
            </p>
            <button
              onClick={() => navigate('/search')}
              className="bg-[#0D3B2E] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              Explore Marketplace
            </button>
          </div>
        )}
      </div>

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
