import React from 'react';
import { Sprout, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#0D3B2E] text-white border-t border-[#1E5E4B] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#1E5E4B]">
          {/* Col 1: Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E2C37A] text-[#0D3B2E] flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-serif font-bold text-white">FarmersHub</span>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Kenya’s digital agricultural marketplace connecting smallholder farmers with buyers, wholesalers, and agricultural services across 47 counties.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E2C37A] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Farmer Marketplace · Zero Middlemen Markup</span>
            </div>
          </div>

          {/* Col 2: Quick Discovery */}
          <div>
            <h3 className="text-sm font-semibold text-[#E2C37A] uppercase tracking-wider mb-3">
              Explore Agriculture
            </h3>
            <ul className="space-y-2 text-xs text-emerald-100/90">
              <li>
                <button onClick={() => navigate('/category/crops-produce')} className="hover:text-white transition-colors">
                  Crops & Fresh Produce
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/livestock')} className="hover:text-white transition-colors">
                  Dairy & Beef Livestock
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/seeds-seedlings')} className="hover:text-white transition-colors">
                  Hybrid Seeds & Seedlings
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/farm-equipment')} className="hover:text-white transition-colors">
                  Tractor & Farm Machinery
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/agricultural-services')} className="hover:text-white transition-colors">
                  Agricultural Services
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Locations */}
          <div>
            <h3 className="text-sm font-semibold text-[#E2C37A] uppercase tracking-wider mb-3">
              Kenya Agricultural Hubs
            </h3>
            <ul className="space-y-2 text-xs text-emerald-100/90">
              <li>
                <button onClick={() => navigate('/search?county=Kericho')} className="hover:text-white transition-colors">
                  Kericho & South Rift (Avocado & Tea)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/search?county=Nakuru')} className="hover:text-white transition-colors">
                  Nakuru & Naivasha (Dairy & Horticulture)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/search?county=Uasin+Gishu')} className="hover:text-white transition-colors">
                  Uasin Gishu & Eldoret (Maize & Wheat)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/search?county=Kiambu')} className="hover:text-white transition-colors">
                  Kiambu & Mt. Kenya (Poultry & Vegetables)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/search?county=Meru')} className="hover:text-white transition-colors">
                  Meru & Eastern (Macadamia & Legumes)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Farmer Support */}
          <div>
            <h3 className="text-sm font-semibold text-[#E2C37A] uppercase tracking-wider mb-3">
              Farmer Help Desk
            </h3>
            <div className="space-y-2.5 text-xs text-emerald-100/90">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E2C37A] shrink-0 mt-0.5" />
                <span>Nairobi & Field Offices in Eldoret, Nakuru & Kericho, Kenya</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E2C37A] shrink-0" />
                <span>+254 (0) 700 FARMERS / +254 722 000 111</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E2C37A] shrink-0" />
                <span>support@farmershub.co.ke</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/register?type=farmer')}
                  className="w-full bg-[#1E5E4B] hover:bg-[#25735c] text-white py-2 rounded-lg text-xs font-semibold text-center border border-[#2e8a6f] transition-colors"
                >
                  Join as Registered Farmer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/60 gap-4">
          <p>© {new Date().getFullYear()} FarmersHub Kenya. Empowering Smallholder Farmers Nationwide.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/search')} className="hover:text-white">
              Marketplace Rules
            </button>
            <span>·</span>
            <button onClick={() => navigate('/admin')} className="hover:text-white">
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
