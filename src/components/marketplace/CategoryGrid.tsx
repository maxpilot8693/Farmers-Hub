import React from 'react';
import { Category } from '../../types';
import {
  Wheat,
  Beef,
  Egg,
  Sprout,
  FlaskConical,
  Tractor,
  Wrench,
  Trees,
  Box,
  ChevronRight,
} from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelectCategory }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wheat':
        return <Wheat className="w-6 h-6 text-[#0D3B2E]" />;
      case 'Beef':
        return <Beef className="w-6 h-6 text-[#0D3B2E]" />;
      case 'Egg':
        return <Egg className="w-6 h-6 text-[#0D3B2E]" />;
      case 'Sprout':
        return <Sprout className="w-6 h-6 text-[#0D3B2E]" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6 text-[#0D3B2E]" />;
      case 'Tractor':
        return <Tractor className="w-6 h-6 text-[#0D3B2E]" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-[#0D3B2E]" />;
      case 'Trees':
        return <Trees className="w-6 h-6 text-[#0D3B2E]" />;
      default:
        return <Box className="w-6 h-6 text-[#0D3B2E]" />;
    }
  };

  return (
    <section className="py-10 bg-[#F8F9F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#0D3B2E]">Browse Agriculture</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a category to discover available produce, livestock, and services across Kenya.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-[#0D3B2E]/40 text-left transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-[#E2C37A]/30 flex items-center justify-center shrink-0 transition-colors">
                  {getIcon(cat.icon)}
                </div>
                {cat.listing_count !== undefined && (
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {cat.listing_count} listings
                  </span>
                )}
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#0D3B2E] transition-colors flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0D3B2E] group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
