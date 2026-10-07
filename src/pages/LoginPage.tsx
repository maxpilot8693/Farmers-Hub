import React, { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { Sprout, LogIn, ArrowRight } from 'lucide-react';
import { SEED_FARMERS } from '../data/seedData';

interface LoginPageProps {
  navigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { loginDemo } = useAuth();
  const [email, setEmail] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    loginDemo(email);
    navigate('/farmer/dashboard');
  };

  const handleSelectDemoAccount = (demoEmail: string) => {
    loginDemo(demoEmail);
    navigate('/farmer/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F9F8] py-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden space-y-6">
        {/* Header */}
        <div className="bg-[#0D3B2E] text-white p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#E2C37A] text-[#0D3B2E] flex items-center justify-center font-bold mx-auto shadow-sm">
            <Sprout className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-serif font-bold">Welcome Back to FarmersHub</h1>
          <p className="text-xs text-emerald-100/80">
            Sign in to manage your farm listings, edit profile, or save favorites.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="p-6 pt-2 space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. farmer@farmershub.co.ke"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <input
              type="password"
              required
              defaultValue="password123"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0D3B2E] hover:bg-[#16503f] text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4 text-[#E2C37A]" />
            <span>Sign In to Your Account</span>
          </button>

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
              Quick Demo Access (Select Account):
            </p>

            <div className="space-y-1.5">
              {SEED_FARMERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleSelectDemoAccount(f.email)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#0D3B2E] bg-slate-50 hover:bg-emerald-50/50 text-xs flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{f.full_name}</span>
                    <span className="text-[10px] text-slate-500">
                      {f.role.toUpperCase()} · {f.county} County
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-bold text-[#0D3B2E] hover:underline"
            >
              Register Here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
