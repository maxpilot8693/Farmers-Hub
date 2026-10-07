import React from 'react';
import { ShieldCheck, Eye, Phone, MapPin, AlertCircle } from 'lucide-react';

export const SafetyTipsCard: React.FC = () => {
  return (
    <div className="bg-emerald-900/10 border border-emerald-900/20 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-[#0D3B2E] font-bold text-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-700" />
        <span>FarmersHub Safe Marketplace Guide</span>
      </div>
      <p className="text-xs text-slate-700 leading-relaxed">
        FarmersHub connects smallholders and buyers directly across Kenya. To ensure safe agricultural trades:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-800 pt-1">
        <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200/80">
          <Eye className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Inspect Before Payment</p>
            <p className="text-[11px] text-slate-500">Always physically verify crop quality, animal health, or equipment condition.</p>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200/80">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Meet at Safe Locations</p>
            <p className="text-[11px] text-slate-500">Meet at farm locations, public produce markets, or cooperative depots.</p>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200/80">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">No Advance Deposits</p>
            <p className="text-[11px] text-slate-500">Never send M-PESA deposits to unverified contacts before receiving goods.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
