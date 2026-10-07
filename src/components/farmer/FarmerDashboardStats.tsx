import React from 'react';
import { PlusCircle, Store, FileText, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { UserProfile } from '../../types';

interface FarmerDashboardStatsProps {
  publishedCount: number;
  draftCount: number;
  soldCount: number;
  farmer: UserProfile;
  navigate: (route: string) => void;
}

export const FarmerDashboardStats: React.FC<FarmerDashboardStatsProps> = ({
  publishedCount,
  draftCount,
  soldCount,
  farmer,
  navigate,
}) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions Header */}
      <div className="bg-[#0D3B2E] text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-white">Farmer Dashboard</h1>
            {farmer.verification_status === 'verified' && (
              <span className="bg-[#E2C37A] text-[#0D3B2E] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Farmer
              </span>
            )}
          </div>
          <p className="text-xs text-emerald-100/90">
            Welcome back, <span className="font-bold text-white">{farmer.full_name}</span> ({farmer.county} County). Manage your farm produce and marketplace presence.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate('/farmer/listings/new')}
            className="flex-1 md:flex-initial bg-[#E2C37A] hover:bg-[#d5b56a] text-[#0D3B2E] font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add New Listing</span>
          </button>
          <button
            onClick={() => navigate('/farmer/profile')}
            className="flex-1 md:flex-initial bg-[#1E5E4B] hover:bg-[#277960] text-white font-medium px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-emerald-600/50"
          >
            <UserCheck className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Practical Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Listings */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold text-slate-700">Active Published Listings</span>
            <Store className="w-5 h-5 text-emerald-700" />
          </div>
          <p className="text-3xl font-bold font-mono text-[#0D3B2E]">{publishedCount}</p>
          <p className="text-[11px] text-slate-500">Live on FarmersHub marketplace</p>
        </div>

        {/* Draft Listings */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold text-slate-700">Draft / Unpublished</span>
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold font-mono text-slate-800">{draftCount}</p>
          <p className="text-[11px] text-slate-500">Pending complete details or review</p>
        </div>

        {/* Sold / Completed */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold text-slate-700">Sold / Completed</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold font-mono text-slate-800">{soldCount}</p>
          <p className="text-[11px] text-slate-500">Listings marked as sold or archived</p>
        </div>
      </div>
    </div>
  );
};
