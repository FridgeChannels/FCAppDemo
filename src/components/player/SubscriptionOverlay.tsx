import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Channel } from '@/types/player';
import { Button } from '@/components/ui/button';

type SubscriptionPlan = 'annual' | 'monthly' | 'free';

interface SubscriptionOverlayProps {
  channel: Channel;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
}

const plans = [
  { id: 'annual' as SubscriptionPlan, label: 'Annual', price: '$298/year', priceDisplay: '$298/year' },
  { id: 'monthly' as SubscriptionPlan, label: 'Monthly', price: '$38/month', priceDisplay: '$38/month' },
  { id: 'free' as SubscriptionPlan, label: 'None', price: 'Free', priceDisplay: 'Free' },
];

const benefits = [
  'Early access to public content',
  'Subscriber-exclusive content and full archive',
  'Participate in comments and community interactions',
  'Ask questions directly to creators and get answers',
];

export const SubscriptionOverlay = ({
  channel,
  isOpen,
  onClose,
  onSubscribe,
}: SubscriptionOverlayProps) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('annual');

  if (!isOpen) return null;

  const currentPlan = plans.find(p => p.id === selectedPlan);

  const handleSubscribe = () => {
    onSubscribe(selectedPlan);
  };

  const selectedPlanObj = plans.find((p) => p.id === selectedPlan) ?? plans[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center no-scroll-x">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Bottom sheet (full-width, slide-up) */}
      <div
        className="relative z-10 w-full bg-[#f2f2f2] rounded-t-3xl animate-slide-up safe-area-bottom"
        style={{ maxHeight: "92vh" }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 sm:right-4 top-3 sm:top-4 inline-flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-full text-neutral-500 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-target"
        >
          <X size={22} />
        </button>

        {/* Content (fit within one screen; no inner scroll) */}
        <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 pt-8 sm:pt-9 flex flex-col gap-3 sm:gap-4 max-h-[92vh] overflow-y-auto">
          {/* Avatar */}
          <div className="flex justify-center">
            <img
              src="/fire.png"
              alt={`${channel.creatorName} logo`}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-[5px] object-cover shadow-md"
            />
          </div>

          {/* Title */}
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 leading-tight text-wrap-safe break-words px-2">
            Subscribe to {channel.name}
          </h2>
          <p className="text-center text-xs sm:text-sm md:text-base text-neutral-500 text-wrap-safe break-words px-2">
            Consider supporting {channel.name} by choosing a paid subscription.
          </p>

          {/* Plan selection card */}
          <div className="rounded-[5px] bg-white p-1.5 shadow-sm">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={[
                    "w-full rounded-[5px] px-3 sm:px-4 py-3 min-h-[44px] text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected ? "bg-neutral-50" : "hover:bg-neutral-50",
                  ].join(" ")}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className={isSelected ? "text-sm sm:text-base font-semibold text-neutral-900" : "text-sm sm:text-base font-semibold text-neutral-500"}>
                          {plan.label}
                        </span>
                        <span className={isSelected ? "text-sm sm:text-base text-neutral-700" : "text-sm sm:text-base text-neutral-400"}>
                          {plan.priceDisplay}
                        </span>
                      </div>
                    </div>

                    <div
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors flex-shrink-0",
                        isSelected ? "border-red-600 bg-red-600" : "border-neutral-300 bg-white",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {isSelected ? <Check size={16} className="text-white" strokeWidth={3} /> : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Benefits */}
          <div className="space-y-2 px-1">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2 sm:gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <Check size={16} className="text-orange-500" strokeWidth={2.5} />
                </div>
                <p className="text-xs sm:text-sm leading-snug text-neutral-800 text-wrap-safe break-words">{benefit}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-1">
            <Button
              onClick={handleSubscribe}
              className="w-full h-12 sm:h-14 rounded-[5px] text-sm sm:text-base font-semibold bg-red-600 hover:bg-red-700 text-white shadow-lg touch-target"
            >
              Subscribe • {selectedPlanObj.priceDisplay}
            </Button>
            <p className="mt-2 text-center text-xs text-neutral-500 text-wrap-safe break-words px-2">
              Or, continue with in-app payment ($388/year)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
