import React, { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { api } from '../lib/api';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { Sprout, UserPlus, CheckCircle2, Store, User } from 'lucide-react';

interface RegisterPageProps {
  initialType?: 'farmer' | 'buyer';
  navigate: (route: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  initialType = 'farmer',
  navigate,
}) => {
  const { setUser } = useAuth();

  const [role, setRole] = useState<'farmer' | 'buyer'>(initialType);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('Kericho');
  const [subCounty, setSubCounty] = useState('');
  const [ward, setWard] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCountyObj = KENYA_COUNTIES.find((c) => c.name === county);
  const subCounties = selectedCountyObj ? selectedCountyObj.subCounties : [];
  const selectedSubCountyObj = subCounties.find((sc) => sc.name === subCounty);
  const wards = selectedSubCountyObj ? selectedSubCountyObj.wards : [];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    setIsSubmitting(true);
    try {
      const newUser = await api.registerUser({
        full_name: fullName,
        email,
        phone,
        county,
        sub_county: subCounty,
        ward,
        role,
      });

      setUser(newUser);
      if (role === 'farmer') {
        navigate('/farmer/listings/new');
      } else {
        navigate('/search');
      }
    } catch (err: any) {
      alert(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8] py-12 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden space-y-6">
        {/* Header */}
        <div className="bg-[#0D3B2E] text-white p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#E2C37A] text-[#0D3B2E] flex items-center justify-center font-bold mx-auto shadow-sm">
            <Sprout className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-serif font-bold">Join FarmersHub Kenya</h1>
          <p className="text-xs text-emerald-100/80">
            Connect directly with buyers and agricultural producers across 47 counties.
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="p-6 pt-2 space-y-5">
          {/* Account Role Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Account Role:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  role === 'farmer'
                    ? 'bg-emerald-50 border-[#0D3B2E] ring-2 ring-[#0D3B2E]/20 text-[#0D3B2E]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Store className="w-4 h-4 text-emerald-700" />
                  <span>I am a Farmer</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  List crops, produce, livestock & farm services
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  role === 'buyer'
                    ? 'bg-emerald-50 border-[#0D3B2E] ring-2 ring-[#0D3B2E]/20 text-[#0D3B2E]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>I am a Buyer</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Browse, compare & contact farmers directly
                </p>
              </button>
            </div>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Full Name / Farm Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Kiprono Cheruiyot"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. kiprono@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
            </div>
          </div>

          {/* Phone & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254712345678"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
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

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0D3B2E] hover:bg-[#16503f] text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-[#E2C37A]" />
            <span>
              {isSubmitting ? 'Creating Account...' : `Register as ${role === 'farmer' ? 'Farmer' : 'Buyer'}`}
            </span>
          </button>

          <div className="text-center text-xs text-slate-500 pt-2">
            Already registered?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-bold text-[#0D3B2E] hover:underline"
            >
              Sign In Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
