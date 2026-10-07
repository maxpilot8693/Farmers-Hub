import React from 'react';
import { ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface VerificationBadgeProps {
  status?: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status = 'unverified',
  size = 'md',
}) => {
  if (status === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : size === 'lg' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-xs'
        }`}
        title="Verified Smallholder Farmer on FarmersHub Kenya"
      >
        <ShieldCheck className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-600`} />
        <span>Verified Farmer</span>
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium text-amber-800 bg-amber-50 border border-amber-200/80 rounded ${
          size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
        }`}
      >
        <Clock className="w-3 h-3 text-amber-600" />
        <span>Verification Pending</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      <AlertCircle className="w-3 h-3 text-slate-400" />
      <span>Registered Member</span>
    </span>
  );
};
