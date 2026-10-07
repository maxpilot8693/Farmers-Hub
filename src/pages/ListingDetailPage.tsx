import React, { useEffect, useState } from 'react';
import { Listing } from '../types';
import { api } from '../lib/api';
import { VerificationBadge } from '../components/marketplace/VerificationBadge';
import { ContactFarmerModal } from '../components/marketplace/ContactFarmerModal';
import { SafetyTipsCard } from '../components/marketplace/SafetyTipsCard';
import {
  MapPin,
  Heart,
  PhoneCall,
  Calendar,
  Tag,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Sprout,
  Store,
  User,
  ShieldCheck,
} from 'lucide-react';

interface ListingDetailPageProps {
  id: string;
  navigate: (route: string) => void;
}

export const ListingDetailPage: React.FC<ListingDetailPageProps> = ({ id, navigate }) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [farmerActiveCount, setFarmerActiveCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadListingDetails() {
      setIsLoading(true);
      try {
        const item = await api.getListingById(id);
        if (item) {
          setListing(item);
          setIsFavorite(item.is_favorite || false);

          if (item.farmer_id) {
            const farmerListings = await api.getFarmerListings(item.farmer_id);
            setFarmerActiveCount(farmerListings.filter((l) => l.status === 'published').length);
          }
        }
      } catch (err) {
        console.error('Error fetching listing details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadListingDetails();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!listing) return;
    const newState = await api.toggleFavorite(listing.id);
    setIsFavorite(newState);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-[#0D3B2E] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <Sprout className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Listing Not Found</h2>
        <p className="text-xs text-slate-500">This agricultural listing may have been sold or archived by the farmer.</p>
        <button
          onClick={() => navigate('/search')}
          className="bg-[#0D3B2E] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          Browse Active Marketplace
        </button>
      </div>
    );
  }

  const primaryImage =
    listing.images && listing.images.length > 0 ? listing.images[0].image_url : null;
  const publishedDateFormatted = new Date(listing.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F8F9F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1 as any)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D3B2E] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Listing'}</span>
            </button>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Image Gallery (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-4/3 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/90 shadow-sm">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={listing.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#0D3B2E] p-8 flex flex-col justify-between text-white">
                  <Sprout className="w-12 h-12 text-[#E2C37A]" />
                  <div>
                    <span className="text-xs text-[#E2C37A] font-bold uppercase">
                      {listing.category?.name}
                    </span>
                    <h2 className="text-xl font-bold">{listing.title}</h2>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-[#0D3B2E] text-[#E2C37A] text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                  {listing.category?.name}
                </span>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#0D3B2E] uppercase tracking-wider border-b border-slate-100 pb-2">
                Product & Listing Description
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          </div>

          {/* RIGHT: Price, Actions & Farmer Spotlight (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
              {/* Location & Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    {listing.location_name || `${listing.county} County`}
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 font-serif leading-snug">
                  {listing.title}
                </h1>

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Published on {publishedDateFormatted}</span>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-1">
                <span className="text-xs text-emerald-800 font-medium">Price:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-serif text-[#0D3B2E]">
                    KSh {listing.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-600 font-medium">/ {listing.price_unit}</span>
                </div>
                <div className="text-xs text-slate-600 font-semibold pt-1">
                  Quantity Available:{' '}
                  <span className="text-[#0D3B2E]">
                    {listing.quantity.toLocaleString()} {listing.unit}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full bg-[#0D3B2E] hover:bg-[#16503f] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all"
                >
                  <PhoneCall className="w-5 h-5 text-[#E2C37A]" />
                  <span>Contact Farmer Directly</span>
                </button>

                <button
                  onClick={handleFavoriteToggle}
                  className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors border ${
                    isFavorite
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-rose-600' : ''}`} />
                  <span>{isFavorite ? 'Saved in Your Favorites' : 'Save Listing to Favorites'}</span>
                </button>
              </div>
            </div>

            {/* ABOUT THE FARMER SPOTLIGHT CARD */}
            {listing.farmer && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  About the Farmer / Producer
                </h3>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#0D3B2E] text-[#E2C37A] font-bold text-xl flex items-center justify-center overflow-hidden shrink-0 border-2 border-emerald-100">
                    {listing.farmer.profile_photo ? (
                      <img
                        src={listing.farmer.profile_photo}
                        alt={listing.farmer.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      listing.farmer.full_name.charAt(0)
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base leading-tight truncate">
                        {listing.farmer.full_name}
                      </h4>
                    </div>
                    <VerificationBadge status={listing.farmer.verification_status} size="sm" />
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                      {listing.farmer.county} County
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>Active Listings:</span>
                    <span className="font-bold text-[#0D3B2E]">{farmerActiveCount}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Account Status:</span>
                    <span className="font-semibold text-emerald-700 capitalize">
                      {listing.farmer.account_status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/farmer/${listing.farmer_id}`)}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#0D3B2E] font-bold py-2.5 px-4 rounded-xl text-xs border border-emerald-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>View Full Farmer Profile</span>
                </button>
              </div>
            )}

            {/* SAFETY TIPS */}
            <SafetyTipsCard />
          </div>
        </div>
      </div>

      {/* CONTACT MODAL */}
      {listing.farmer && (
        <ContactFarmerModal
          listing={listing}
          farmer={listing.farmer}
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      )}
    </div>
  );
};
