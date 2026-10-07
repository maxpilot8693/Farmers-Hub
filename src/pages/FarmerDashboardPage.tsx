import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/authContext';
import { Listing } from '../types';
import { api } from '../lib/api';
import { FarmerDashboardStats } from '../components/farmer/FarmerDashboardStats';
import { PlusCircle, Edit, Trash2, Eye, Store, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface FarmerDashboardPageProps {
  navigate: (route: string) => void;
}

export const FarmerDashboardPage: React.FC<FarmerDashboardPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardListings() {
      if (!user) return;
      setIsLoading(true);
      try {
        const farmerListings = await api.getFarmerListings(user.id);
        setListings(farmerListings);
      } catch (err) {
        console.error('Error fetching dashboard listings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardListings();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Farmer Authentication Required</h2>
        <p className="text-xs text-slate-500">Please sign in to access your farmer dashboard.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#0D3B2E] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          Sign In
        </button>
      </div>
    );
  }

  const publishedListings = listings.filter((l) => l.status === 'published');
  const draftListings = listings.filter((l) => l.status === 'draft');
  const soldListings = listings.filter((l) => l.status === 'sold' || l.status === 'archived');

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      await api.deleteListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleToggleStatus = async (listing: Listing) => {
    const newStatus = listing.status === 'published' ? 'sold' : 'published';
    const updated = await api.updateListing(listing.id, { status: newStatus });
    setListings((prev) => prev.map((l) => (l.id === listing.id ? updated : l)));
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Stats Header */}
        <FarmerDashboardStats
          publishedCount={publishedListings.length}
          draftCount={draftListings.length}
          soldCount={soldListings.length}
          farmer={user}
          navigate={navigate}
        />

        {/* Listings Management Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#0D3B2E] flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-700" />
                <span>Your Marketplace Listings</span>
              </h2>
              <p className="text-xs text-slate-500">Manage pricing, availability and publication status.</p>
            </div>

            <button
              onClick={() => navigate('/farmer/listings/new')}
              className="bg-[#0D3B2E] hover:bg-[#16503f] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-[#E2C37A]" />
              <span>+ Add Listing</span>
            </button>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading listings...</div>
          ) : listings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4">Listing Title & Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {listings.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            {l.images && l.images[0]?.image_url ? (
                              <img
                                src={l.images[0].image_url}
                                alt={l.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#0D3B2E] text-[#E2C37A] font-bold text-xs flex items-center justify-center">
                                Ag
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{l.title}</p>
                            <p className="text-[11px] text-slate-500">{l.category?.name || 'Produce'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-[#0D3B2E] whitespace-nowrap">
                        KSh {l.price.toLocaleString()} / {l.price_unit}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {l.quantity.toLocaleString()} {l.unit}
                      </td>

                      <td className="p-4 whitespace-nowrap text-slate-600">
                        {l.county} County
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        {l.status === 'published' ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Live
                          </span>
                        ) : l.status === 'draft' ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                            Sold / Archived
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/listing/${l.id}`)}
                            className="p-1.5 text-slate-600 hover:text-[#0D3B2E] hover:bg-emerald-50 rounded-lg transition-colors"
                            title="View Public Listing"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/farmer/listings/${l.id}/edit`)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Listing"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(l)}
                            className="px-2 py-1 text-[11px] font-bold border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 bg-slate-50 transition-colors"
                          >
                            {l.status === 'published' ? 'Mark Sold' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDelete(l.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <Store className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">You haven't added any listings yet</h3>
              <p className="text-xs text-slate-500">
                Create your first agricultural listing to connect with buyers across Kenya.
              </p>
              <button
                onClick={() => navigate('/farmer/listings/new')}
                className="bg-[#0D3B2E] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm"
              >
                + Create First Listing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
