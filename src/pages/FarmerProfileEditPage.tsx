import React, { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { api } from '../lib/api';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { ArrowLeft, Save, User, MapPin, Phone, Mail, Camera } from 'lucide-react';

interface FarmerProfileEditPageProps {
  navigate: (route: string) => void;
}

export const FarmerProfileEditPage: React.FC<FarmerProfileEditPageProps> = ({ navigate }) => {
  const { user, setUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [county, setCounty] = useState(user?.county || 'Kericho');
  const [subCounty, setSubCounty] = useState(user?.sub_county || '');
  const [ward, setWard] = useState(user?.ward || '');
  const [photoUrl, setPhotoUrl] = useState(user?.profile_photo || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Please Sign In</h2>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#0D3B2E] text-white px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          Sign In
        </button>
      </div>
    );
  }

  const selectedCountyObj = KENYA_COUNTIES.find((c) => c.name === county);
  const subCounties = selectedCountyObj ? selectedCountyObj.subCounties : [];
  const selectedSubCountyObj = subCounties.find((sc) => sc.name === subCounty);
  const wards = selectedSubCountyObj ? selectedSubCountyObj.wards : [];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    try {
      const updated = await api.updateFarmerProfile(user.id, {
        full_name: fullName,
        phone,
        county,
        sub_county: subCounty,
        ward,
        profile_photo: photoUrl,
        bio,
      });

      setUser(updated);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8] py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <button
          onClick={() => navigate('/farmer/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D3B2E] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#0D3B2E] text-white p-6">
            <h1 className="text-xl font-serif font-bold">Edit Farmer Business Profile</h1>
            <p className="text-xs text-emerald-100/80 mt-1">
              Keep your contact details and farm location up-to-date so buyers can reach you easily.
            </p>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-5">
            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold text-center">
                {successMsg}
              </div>
            )}

            {/* Photo Avatar URL */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Profile / Farm Photo URL</label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-[#E2C37A] font-bold text-xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    fullName.charAt(0)
                  )}
                </div>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
                />
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Full Name / Farm Title</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Primary Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254700000000"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">County</label>
                <select
                  value={county}
                  onChange={(e) => {
                    setCounty(e.target.value);
                    setSubCounty('');
                    setWard('');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0D3B2E] focus:outline-none cursor-pointer"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Sub-County</label>
                <select
                  value={subCounty}
                  onChange={(e) => {
                    setSubCounty(e.target.value);
                    setWard('');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0D3B2E] focus:outline-none cursor-pointer"
                >
                  <option value="">Select Sub-County</option>
                  {subCounties.map((sc) => (
                    <option key={sc.name} value={sc.name}>
                      {sc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Ward</label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0D3B2E] focus:outline-none cursor-pointer"
                >
                  <option value="">Select Ward</option>
                  {wards.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1 pt-2">
              <label className="block text-xs font-bold text-slate-700">Short Farm Bio & Experience</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell buyers about your agricultural background, farm size, crops grown, or livestock breeds..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/farmer/dashboard')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-[#0D3B2E] hover:bg-[#16503f] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4 text-[#E2C37A]" />
                <span>{isSaving ? 'Saving...' : 'Save Profile Updates'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
