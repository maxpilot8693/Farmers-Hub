import React, { useState } from 'react';
import { Listing, UserProfile } from '../../types';
import { VerificationBadge } from './VerificationBadge';
import { Phone, MessageCircle, Mail, MapPin, X, ShieldAlert, CheckCircle2, Copy, ExternalLink } from 'lucide-react';

interface ContactFarmerModalProps {
  listing: Listing;
  farmer: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactFarmerModal: React.FC<ContactFarmerModalProps> = ({
  listing,
  farmer,
  isOpen,
  onClose,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen) return null;

  const phone = listing.contact_phone || farmer.phone || '+254700000000';
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('254')
    ? cleanPhone
    : cleanPhone.startsWith('0')
    ? `254${cleanPhone.substring(1)}`
    : cleanPhone;

  const whatsappMessage = encodeURIComponent(
    `Jambo ${farmer.full_name}, I saw your listing on FarmersHub: "${listing.title}" (${listing.county}). Is it still available?`
  );
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${whatsappMessage}`;

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0D3B2E] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#E2C37A] text-[#0D3B2E] flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 border-2 border-white/20">
              {farmer.profile_photo ? (
                <img
                  src={farmer.profile_photo}
                  alt={farmer.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                farmer.full_name.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">{farmer.full_name}</h3>
                <VerificationBadge status={farmer.verification_status} size="sm" />
              </div>
              <p className="text-xs text-emerald-100/90 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#E2C37A]" />
                {farmer.ward ? `${farmer.ward}, ` : ''}
                {farmer.sub_county ? `${farmer.sub_county}, ` : ''}
                {farmer.county} County
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
            <p className="font-medium text-slate-900 mb-0.5">Listing Inquiry:</p>
            <p className="font-semibold text-[#0D3B2E]">{listing.title}</p>
            <p className="text-slate-500 mt-0.5">
              Price: <span className="font-bold text-emerald-700">KSh {listing.price.toLocaleString()}</span> / {listing.price_unit}
            </p>
          </div>

          <div className="space-y-2.5">
            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-sm shadow-sm transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-4 h-4 opacity-70 ml-auto" />
            </a>

            {/* Direct Phone Call */}
            <a
              href={`tel:${phone}`}
              className="w-full bg-[#0D3B2E] hover:bg-[#154d3e] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-sm shadow-sm transition-all"
            >
              <Phone className="w-5 h-5" />
              <span>Call Farmer ({phone})</span>
            </a>

            {/* Copy Number */}
            <button
              onClick={copyPhoneNumber}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
            >
              {copiedPhone ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Phone Number Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Phone Number to Clipboard</span>
                </>
              )}
            </button>
          </div>

          {/* Safety Notice */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Marketplace Safety Guidance:</span>
            </div>
            <ul className="text-amber-800 space-y-0.5 list-disc list-inside pl-1 text-[11px]">
              <li>Meet in a safe public market or inspect farm produce/livestock in person.</li>
              <li>Do NOT send advance M-PESA deposits before inspecting goods.</li>
              <li>FarmersHub connects buyers and farmers directly; transactions are completed independently.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
