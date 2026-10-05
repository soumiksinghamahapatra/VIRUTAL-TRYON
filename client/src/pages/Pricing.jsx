import React, { useState, useEffect } from 'react';
import { subscriptionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

const Pricing = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgradingPlan, setUpgradingPlan] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await subscriptionAPI.getPlans();
        setPlans(res.data.data);
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleUpgrade = async (planId) => {
    if (!isAuthenticated) {
      alert('Please sign in or create an account first to select a plan.');
      return;
    }

    setUpgradingPlan(planId);
    try {
      const res = await subscriptionAPI.upgradePlan(planId);
      updateUser({ plan: planId });
      alert(res.data.message);
    } catch (err) {
      console.error('Upgrade failed:', err);
      alert('Upgrade error. Please try again.');
    } finally {
      setUpgradingPlan(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAFAFA] border border-[#D4D4D4] text-xs font-semibold uppercase tracking-wider text-[#000000]">
          <Sparkles className="w-3.5 h-3.5" />
          Transparent Membership Tiers
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#000000]">
          Invest in your signature style
        </h1>
        <p className="text-base text-[#525252] max-w-xl mx-auto">
          Choose the plan that fits your wardrobe goals. Upgrade or cancel anytime with zero friction.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-[#D4D4D4] border-t-[#000000] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isCurrent = user?.plan === plan.id;
            const isPro = plan.id === 'pro';

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 border flex flex-col justify-between transition-all relative ${
                  isPro
                    ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] shadow-xl md:-translate-y-2'
                    : 'bg-white text-[#000000] border-[#E5E5E5] shadow-sm hover:shadow-md'
                }`}
              >
                {/* Popular Ribbon */}
                {isPro && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#D4D4D4] text-[#000000] shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${
                        isPro ? 'text-[#D4D4D4]' : 'text-[#000000]'
                      }`}
                    >
                      {plan.name}
                    </span>
                    {isCurrent && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPro
                            ? 'bg-[#171717] text-[#D4D4D4]'
                            : 'bg-[#FAFAFA] text-[#000000]'
                        }`}
                      >
                        Active Plan
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-serif text-5xl font-bold">
                      ${plan.price}
                    </span>
                    <span
                      className={`text-xs ${
                        isPro ? 'text-[#D4D4D4]/80' : 'text-[#404040]'
                      }`}
                    >
                      / {plan.billingPeriod}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-4 border-t border-current/10">
                    {plan.features?.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs leading-relaxed">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isPro
                              ? 'bg-[#D4D4D4] text-[#000000]'
                              : 'bg-[#000000] text-[#FFFFFF]'
                          }`}
                        >
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className={isPro ? 'text-[#D4D4D4]/90' : 'text-[#525252]'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to action button */}
                <div className="pt-8 mt-6 border-t border-current/10">
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent || upgradingPlan === plan.id}
                    className={`w-full py-3 rounded-full font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'opacity-50 cursor-default bg-gray-200 text-gray-700'
                        : isPro
                        ? 'bg-[#D4D4D4] text-[#000000] hover:bg-white shadow-md'
                        : 'bg-[#000000] text-[#FFFFFF] hover:bg-[#171717]'
                    }`}
                  >
                    {upgradingPlan === plan.id ? (
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isCurrent ? (
                      'Current Active Plan'
                    ) : (
                      <>
                        <span>Select {plan.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Guarantee callout */}
      <div className="bg-[#FAFAFA] rounded-3xl p-6 sm:p-8 border border-[#D4D4D4] text-center max-w-2xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#000000]">
          <ShieldCheck className="w-5 h-5 text-[#000000]" />
          <span>100% Satisfaction Styling Guarantee</span>
        </div>
        <p className="text-xs text-[#525252]">
          Cancel anytime with 1 click in your account settings. All active color profiles and wardrobe catalogs remain preserved forever.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
