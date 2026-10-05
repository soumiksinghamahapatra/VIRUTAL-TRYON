import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, X, Check, ArrowRight } from 'lucide-react';

const PaywallModal = ({ isOpen, onClose, featureTitle = 'Unlock Unlimited Styling' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#D4D4D4] shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4D4D4]/40 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#525252] hover:bg-[#FAFAFA] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="w-12 h-12 rounded-2xl bg-[#000000] text-[#D4D4D4] flex items-center justify-center mb-5 shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#000000]">
          MAISON Pro Membership
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#000000] mt-1 mb-2">
          {featureTitle}
        </h3>
        <p className="text-sm text-[#525252] leading-relaxed mb-6">
          Upgrade to MAISON Pro for comprehensive personal styling, unlimited closet uploads, and instant 24/7 AI consultations.
        </p>

        {/* Features List */}
        <div className="space-y-3 mb-6 bg-white/70 p-4 rounded-2xl border border-[#E5E5E5]">
          {[
            'Unlimited digital closet items & photos',
            'Deep 12-season color science analysis',
            'Unlimited 24/7 AI Stylist consultations',
            'Inspiration & street look closet matching',
            'Occasion capsules & packing lookbooks',
          ].map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-[#000000] font-medium">
              <div className="w-4 h-4 rounded-full bg-[#000000] text-[#FFFFFF] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            to="/pricing"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#000000] text-[#FFFFFF] font-semibold hover:bg-[#171717] transition-all shadow-sm"
          >
            <span>Upgrade to Pro — $19/mo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={onClose}
            className="text-xs font-medium text-[#404040] hover:text-[#000000] py-1"
          >
            Continue with Free Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
