import React, { useEffect, useState } from 'react';
import { UserProfile, Listing } from '../types';
import { api } from '../lib/api';
import { FarmerProfileCard } from '../components/farmer/FarmerProfileCard';
import { ListingCard } from '../components/marketplace/ListingCard';
import { ContactFarmerModal } from '../components/marketplace/ContactFarmerModal';
import { ArrowLeft, Sprout, Store } from 'lucide-react';

interface FarmerProfilePageProps {
  id: string;
  navigate: (route: string) => void;
}

export const FarmerProfilePage: React.FC<FarmerProfilePageProps> = ({ id, navigate }) => {
  const [farmer, setFarmer] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [contactModalData, setContactModalData] = useState<{
    listing: Listing;
    farmer: any;
  } | null>(null);

  useEffect(() => {
    async function loadFarmerProfile() {
      setIsLoading(true);
      try {
        const profile = await api.getFarmerProfile(id);
        setFarmer(profile);

        const farmerListings = await api.getFarmerListings(id);
        setListings(farmerListings.filter((l) => l.status === 'published'));
      } catch (err) {
        console.error('Error fetching farmer profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFarmerProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-[#0D3B2E] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <Sprout className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Farmer Profile Not Found</h2>
        <button
          onClick={() => navigate('/search')}
          className="bg-[#0D3B2E] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation back */}
        <button
          onClick={() => navigate(-1 as any)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D3B2E] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Farmer Profile Overview */}
        <FarmerProfileCard farmer={farmer} activeCount={listings.length} navigate={navigate} />

        {/* Farmer Listings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-[#0D3B2E] font-serif font-bold text-xl">
              <Store className="w-5 h-5 text-emerald-700" />
              <span>Listings by {farmer.full_name}</span>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
              {listings.length} Active
            </span>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={{ ...listing, farmer }}
                  navigate={navigate}
                  onContactClick={(l) => setContactModalData({ listing: l, farmer })}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-2 max-w-md mx-auto my-6">
              <Sprout className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No active listings currently</h3>
              <p className="text-xs text-slate-500">
                This farmer has no published listings at the moment.
              </p>
            </div>
          )}
        </div>
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
