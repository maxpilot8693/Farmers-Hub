import React from 'react';
import { UserProfile } from '../../types';
import { VerificationBadge } from '../marketplace/VerificationBadge';
import { MapPin, Phone, Mail, Calendar, Store, ShieldCheck, UserCheck } from 'lucide-react';

interface FarmerProfileCardProps {
  farmer: UserProfile;
  activeCount?: number;
  navigate?: (route: string) => void;
}

export const FarmerProfileCard: React.FC<FarmerProfileCardProps> = ({
  farmer,
  activeCount = 0,
  navigate,
}) => {
  const memberSinceYear = farmer.created_at
    ? new Date(farmer.created_at).getFullYear()
    : 2025;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Photo Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#0D3B2E] text-[#E2C37A] flex items-center justify-center font-bold text-2xl overflow-hidden shadow-sm shrink-0">
            {farmer.profile_photo ? (
              <img
                src={farmer.profile_photo}
                alt={farmer.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              farmer.full_name.charAt(0)
            )}
          </div>
          {farmer.verification_status === 'verified' && (
            <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Farmer Metadata */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-serif">{farmer.full_name}</h2>
            <VerificationBadge status={farmer.verification_status} size="md" />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>
                {farmer.ward ? `${farmer.ward}, ` : ''}
                {farmer.sub_county ? `${farmer.sub_county}, ` : ''}
                {farmer.county} County
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Member since {memberSinceYear}</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-[#0D3B2E] font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
            <Store className="w-3.5 h-3.5 text-emerald-700" />
            <span>{activeCount} Active Agricultural Listings</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {farmer.bio && (
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-900 mb-1">About Farm & Producer:</p>
          <p>{farmer.bio}</p>
        </div>
      )}

      {/* Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100">
        <div className="flex items-center gap-2 p-2.5 bg-emerald-50/50 rounded-xl text-emerald-950 font-medium">
          <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <span className="block text-[10px] text-emerald-700 uppercase font-bold">Direct Phone</span>
            <span className="font-mono font-bold">{farmer.phone || '+254 700 000000'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl text-slate-800 font-medium">
          <Mail className="w-4 h-4 text-slate-500 shrink-0" />
          <div className="min-w-0">
            <span className="block text-[10px] text-slate-500 uppercase font-bold">Email Address</span>
            <span className="truncate block font-mono">{farmer.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
