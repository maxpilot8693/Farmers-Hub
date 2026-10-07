import React from 'react';
import { Listing } from '../../types';
import { VerificationBadge } from './VerificationBadge';
import { MapPin, Heart, PhoneCall, ArrowUpRight, Sprout } from 'lucide-react';
import { api } from '../../lib/api';

interface ListingCardProps {
  listing: Listing;
  navigate: (route: string) => void;
  onContactClick?: (listing: Listing) => void;
  onFavoriteToggle?: (listingId: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  navigate,
  onContactClick,
  onFavoriteToggle,
}) => {
  const [isFavorite, setIsFavorite] = React.useState(listing.is_favorite || false);
  const [imgError, setImgError] = React.useState(false);

  const primaryImage =
    listing.images && listing.images.length > 0 ? listing.images[0].image_url : null;

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = await api.toggleFavorite(listing.id);
    setIsFavorite(newState);
    if (onFavoriteToggle) {
      onFavoriteToggle(listing.id);
    }
  };

  return (
    <div
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="group bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden shrink-0">
        {primaryImage && !imgError ? (
          <img
            src={primaryImage}
            alt={listing.title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-[#0D3B2E] p-4 flex flex-col justify-between text-white">
            <Sprout className="w-8 h-8 text-[#E2C37A] opacity-80" />
            <div>
              <span className="text-[10px] text-[#E2C37A] uppercase tracking-wider font-semibold">
                {listing.category?.name || 'Agricultural Produce'}
              </span>
              <p className="text-sm font-bold text-white line-clamp-2">{listing.title}</p>
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="bg-[#0D3B2E]/90 backdrop-blur-xs text-[#E2C37A] text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
            {listing.category?.name?.replace(/^[^\s]+\s/, '') || 'Produce'}
          </span>

          <button
            onClick={handleFavorite}
            className={`p-2 rounded-full backdrop-blur-xs transition-colors pointer-events-auto ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500'
            }`}
            aria-label="Save listing"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Availability tag */}
        {!listing.is_available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-sm tracking-wide">
            Currently Unavailable
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">
              {listing.sub_county ? `${listing.sub_county}, ` : ''}
              {listing.county}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-[#0D3B2E] transition-colors">
            {listing.title}
          </h3>

          {/* Quantity inline info */}
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
            <span>Quantity:</span>
            <span className="font-semibold text-slate-800">
              {listing.quantity.toLocaleString()} {listing.unit}
            </span>
          </div>
        </div>

        {/* Price & Farmer Info */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Price: </span>
              <span className="text-lg font-bold text-[#0D3B2E]">
                KSh {listing.price.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium"> / {listing.price_unit}</span>
            </div>
          </div>

          {/* Farmer row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-emerald-800 text-[#E2C37A] text-xs font-bold flex items-center justify-center shrink-0">
                {listing.farmer?.full_name ? listing.farmer.full_name.charAt(0) : 'F'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate">
                  {listing.farmer?.full_name || 'Kenyan Farmer'}
                </p>
              </div>
            </div>
            {listing.farmer && (
              <VerificationBadge status={listing.farmer.verification_status} size="sm" />
            )}
          </div>

          {/* Action Button Bar */}
          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onContactClick) {
                  onContactClick(listing);
                } else {
                  navigate(`/listing/${listing.id}`);
                }
              }}
              className="flex-1 bg-[#0D3B2E] hover:bg-[#16503f] text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#E2C37A]" />
              <span>Contact Farmer</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/listing/${listing.id}`);
              }}
              className="p-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
              title="View full listing details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
