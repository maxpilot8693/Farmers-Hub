import React, { useState } from 'react';
import { Search, MapPin, Sprout, ArrowRight, ShieldCheck, Truck, Users } from 'lucide-react';
import { KENYA_COUNTIES } from '../../data/kenyaCounties';
import { heroBannerImg } from '../../data/seedData';

interface HeroSectionProps {
  onSearch: (query: string, county: string) => void;
  navigate: (route: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedCounty);
  };

  return (
    <section className="relative bg-[#0D3B2E] text-white overflow-hidden py-12 md:py-16">
      {/* Background Image Scrim */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src={heroBannerImg}
          alt="Kenyan agricultural farm landscape"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D3B2E] via-[#0D3B2E]/90 to-[#0D3B2E]/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          {/* Trust Banner */}
          <div className="inline-flex items-center gap-2 bg-[#1E5E4B]/80 backdrop-blur-xs text-[#E2C37A] border border-[#2d8168]/60 text-xs font-semibold px-3 py-1 rounded-lg">
            <Sprout className="w-4 h-4" />
            <span>Direct Smallholder Marketplace Across 47 Kenyan Counties</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight text-balance">
            Find agricultural products, farmers and services near you.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
            Discover produce, livestock, farm inputs, equipment and agricultural services directly from farmers and verified agricultural producers across Kenya.
          </p>

          {/* WHAT + WHERE Discovery Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xl border border-white/20 text-slate-800 flex flex-col md:flex-row items-stretch gap-2.5"
          >
            {/* WHAT INPUT */}
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 md:bg-transparent rounded-xl md:rounded-none">
              <Search className="w-5 h-5 text-[#0D3B2E] shrink-0" />
              <div className="w-full">
                <label htmlFor="hero-what" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  What are you looking for?
                </label>
                <input
                  id="hero-what"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Hass Avocados, Dairy Cow, Seeds, Tractor..."
                  className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-slate-200 my-1"></div>

            {/* WHERE SELECTOR */}
            <div className="w-full md:w-56 flex items-center gap-2.5 px-3 py-2 bg-slate-50 md:bg-transparent rounded-xl md:rounded-none">
              <MapPin className="w-5 h-5 text-emerald-700 shrink-0" />
              <div className="w-full">
                <label htmlFor="hero-where" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Where in Kenya?
                </label>
                <select
                  id="hero-where"
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="">All Counties</option>
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name} County
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEARCH BUTTON */}
            <button
              type="submit"
              className="bg-[#0D3B2E] hover:bg-[#16503f] text-white font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm shrink-0"
            >
              <span>Search Marketplace</span>
              <ArrowRight className="w-4 h-4 text-[#E2C37A]" />
            </button>
          </form>

          {/* Quick Keyword Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-100/80 pt-1">
            <span className="font-semibold text-white">Popular searches:</span>
            {['Hass Avocados', 'Friesian Cow', 'Tractor Services', 'Tomatoes', 'Maize Bags', 'Seedlings'].map(
              (kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => onSearch(kw, '')}
                  className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 hover:text-white px-2.5 py-1 rounded-md transition-colors border border-emerald-700/50"
                >
                  {kw}
                </button>
              )
            )}
          </div>
        </div>

        {/* Feature Value Props */}
        <div className="mt-12 pt-8 border-t border-[#1E5E4B] grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E5E4B] text-[#E2C37A] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Direct Farmer Contacts</p>
              <p className="text-emerald-100/70">Connect directly via Call or WhatsApp without middleman fees.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E5E4B] text-[#E2C37A] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Local County Discovery</p>
              <p className="text-emerald-100/70">Find produce, livestock and services right in your county or sub-county.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E5E4B] text-[#E2C37A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Verified Smallholders</p>
              <p className="text-emerald-100/70">Transparent farmer profiles with active listings and location credentials.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
