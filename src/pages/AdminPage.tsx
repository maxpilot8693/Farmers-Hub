import React, { useEffect, useState } from 'react';
import { UserProfile, Listing } from '../types';
import { api } from '../lib/api';
import { ShieldCheck, Users, Store, AlertTriangle, CheckCircle, Ban } from 'lucide-react';

interface AdminPageProps {
  navigate: (route: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navigate }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'listings'>('users');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setIsLoading(true);
      try {
        const [allUsers, allListings] = await Promise.all([
          api.getAllUsers(),
          api.getAllListingsAdmin(),
        ]);
        setUsers(allUsers);
        setListings(allListings);
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleToggleVerification = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'verified' ? 'unverified' : 'verified';
    const updated = await api.updateFarmerProfile(userId, {
      verification_status: newStatus as any,
    });
    setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
  };

  const handleToggleListingStatus = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'published' : 'suspended';
    const updated = await api.updateListing(listingId, { status: newStatus as any });
    setListings((prev) => prev.map((l) => (l.id === listingId ? updated : l)));
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Admin Header */}
        <div className="bg-[#0D3B2E] text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#E2C37A]" />
              <h1 className="text-2xl font-serif font-bold">FarmersHub Admin Console</h1>
            </div>
            <p className="text-xs text-emerald-100/80">
              Manage farmer verification credentials, listing moderation and account security.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#1E5E4B] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'users' ? 'bg-[#E2C37A] text-[#0D3B2E]' : 'text-white hover:text-emerald-100'
              }`}
            >
              Manage Farmers ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'listings' ? 'bg-[#E2C37A] text-[#0D3B2E]' : 'text-white hover:text-emerald-100'
              }`}
            >
              Manage Listings ({listings.length})
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading admin records...</div>
          ) : activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4">Farmer / User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">County</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 font-medium">
                      <td className="p-4 font-bold text-slate-900">{u.full_name}</td>
                      <td className="p-4 capitalize text-slate-600">{u.role}</td>
                      <td className="p-4 text-slate-600">{u.county} County</td>
                      <td className="p-4 text-slate-600 font-mono">{u.phone}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.verification_status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {u.verification_status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleVerification(u.id, u.verification_status)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 font-bold rounded-lg text-slate-800 text-[11px]"
                        >
                          {u.verification_status === 'verified' ? 'Revoke Verification' : 'Verify Farmer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Farmer</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {listings.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50 font-medium">
                      <td className="p-4 font-bold text-slate-900">{l.title}</td>
                      <td className="p-4 text-slate-600">{l.farmer?.full_name || 'Farmer'}</td>
                      <td className="p-4 font-bold text-[#0D3B2E]">
                        KSh {l.price.toLocaleString()} / {l.price_unit}
                      </td>
                      <td className="p-4 text-slate-600">{l.county} County</td>
                      <td className="p-4 uppercase font-bold text-[10px]">
                        <span
                          className={
                            l.status === 'published'
                              ? 'text-emerald-700'
                              : l.status === 'suspended'
                              ? 'text-red-600'
                              : 'text-slate-500'
                          }
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleListingStatus(l.id, l.status)}
                          className={`px-3 py-1 font-bold rounded-lg text-[11px] ${
                            l.status === 'suspended'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          {l.status === 'suspended' ? 'Approve & Publish' : 'Suspend Listing'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
