import React, { useState } from 'react';
import { useAuth } from '../../lib/authContext';
import {
  Sprout,
  Search,
  PlusCircle,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Store,
  Compass,
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const { user, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0D3B2E] text-white shadow-sm border-b border-[#1E5E4B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ZONE 1: BRAND WORDMARK */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-[#E2C37A] rounded-md p-1 transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-[#E2C37A] text-[#0D3B2E] flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                <Sprout className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-serif block leading-none">
                  FarmersHub
                </span>
                <span className="text-[10px] text-[#E2C37A] tracking-wider uppercase font-medium">
                  Kenya Agricultural Marketplace
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-emerald-100/90">
            <button
              onClick={() => navigate('/search')}
              className={`hover:text-white transition-colors flex items-center gap-1.5 py-1 ${
                currentRoute === '/search' ? 'text-white border-b-2 border-[#E2C37A] font-semibold' : ''
              }`}
            >
              <Compass className="w-4 h-4 text-[#E2C37A]" />
              Browse Marketplace
            </button>
            <button
              onClick={() => navigate('/categories')}
              className={`hover:text-white transition-colors py-1 ${
                currentRoute === '/categories' ? 'text-white border-b-2 border-[#E2C37A] font-semibold' : ''
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => navigate('/favorites')}
              className={`hover:text-white transition-colors flex items-center gap-1.5 py-1 ${
                currentRoute === '/favorites' ? 'text-white border-b-2 border-[#E2C37A] font-semibold' : ''
              }`}
            >
              <Heart className="w-4 h-4 text-rose-300" />
              Saved Listings
            </button>
          </nav>

          {/* ZONE 3: ACTIONS */}
          <div className="hidden md:flex items-center gap-3">
            {/* List Your Farm CTA */}
            <button
              onClick={() => {
                if (user && user.role === 'farmer') {
                  navigate('/farmer/listings/new');
                } else if (user) {
                  switchRole('farmer');
                  navigate('/farmer/listings/new');
                } else {
                  navigate('/register?type=farmer');
                }
              }}
              className="bg-[#E2C37A] text-[#0D3B2E] hover:bg-[#d8b86d] font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>List Your Farm / Sell</span>
            </button>

            {/* Auth/Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-[#1E5E4B] hover:bg-[#25735c] px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors focus:outline-none"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-800 text-[#E2C37A] flex items-center justify-center text-xs font-bold uppercase">
                    {user.full_name ? user.full_name.charAt(0) : 'U'}
                  </div>
                  <span className="max-w-[110px] truncate">{user.full_name}</span>
                  {user.verification_status === 'verified' && (
                    <ShieldCheck className="w-4 h-4 text-[#E2C37A]" />
                  )}
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold truncate">{user.full_name}</p>
                      <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[#0D3B2E] bg-emerald-50 px-2 py-0.5 rounded">
                        <span>Role:</span>
                        <span className="capitalize font-bold">{user.role}</span>
                      </div>
                    </div>

                    {user.role === 'farmer' && (
                      <>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            navigate('/farmer/dashboard');
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#0D3B2E]" />
                          Farmer Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            navigate('/farmer/listings');
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                        >
                          <Store className="w-4 h-4 text-[#0D3B2E]" />
                          My Listings
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate(`/farmer/${user.id}`);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      View Public Profile
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/favorites');
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      Saved Listings
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    {/* Role Switcher */}
                    <div className="px-4 py-1.5 text-xs text-slate-400">Switch Account View:</div>
                    <button
                      onClick={() => {
                        switchRole(user.role === 'farmer' ? 'buyer' : 'farmer');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                    >
                      Switch to {user.role === 'farmer' ? 'Buyer Mode' : 'Farmer Mode'}
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => {
                          switchRole('admin');
                          setUserDropdownOpen(false);
                          navigate('/admin');
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        Switch to Admin Console
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="text-emerald-100 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-emerald-800 text-white hover:bg-emerald-700 border border-emerald-600 text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU TRIGGER */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => {
                if (user && user.role === 'farmer') {
                  navigate('/farmer/listings/new');
                } else if (user) {
                  switchRole('farmer');
                  navigate('/farmer/listings/new');
                } else {
                  navigate('/register?type=farmer');
                }
              }}
              className="bg-[#E2C37A] text-[#0D3B2E] font-bold text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Sell</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-[#1E5E4B] rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D3B2E] border-t border-[#1E5E4B] px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/search');
            }}
            className="w-full text-left py-2 text-emerald-100 hover:text-white font-medium flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-[#E2C37A]" />
            Search & Browse Marketplace
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/categories');
            }}
            className="w-full text-left py-2 text-emerald-100 hover:text-white font-medium"
          >
            Categories
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/favorites');
            }}
            className="w-full text-left py-2 text-emerald-100 hover:text-white font-medium flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-rose-300" />
            Saved Listings
          </button>

          {user ? (
            <div className="pt-3 border-t border-[#1E5E4B] space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <User className="w-4 h-4 text-[#E2C37A]" />
                <span>{user.full_name}</span>
                <span className="text-xs bg-[#1E5E4B] text-[#E2C37A] px-2 py-0.5 rounded uppercase font-bold">
                  {user.role}
                </span>
              </div>
              {user.role === 'farmer' && (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/farmer/dashboard');
                    }}
                    className="w-full text-left py-1.5 text-sm text-emerald-200"
                  >
                    Farmer Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/farmer/listings');
                    }}
                    className="w-full text-left py-1.5 text-sm text-emerald-200"
                  >
                    My Listings
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(`/farmer/${user.id}`);
                }}
                className="w-full text-left py-1.5 text-sm text-emerald-200"
              >
                My Public Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="w-full text-left py-2 text-sm text-rose-300 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#1E5E4B] flex items-center gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="flex-1 text-center bg-[#1E5E4B] text-white py-2 rounded-lg text-sm font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/register');
                }}
                className="flex-1 text-center bg-[#E2C37A] text-[#0D3B2E] py-2 rounded-lg text-sm font-bold"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
