import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Channel } from '@/types/player';
import { Button } from '@/components/ui/button';
import creatorAvatar from '@/assets/creator-avatar.jpg';

type SubscriptionPlan = 'annual' | 'monthly' | 'free';

interface SubscriptionOverlayProps {
  channel: Channel;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
}

const plans = [
  { id: 'annual' as SubscriptionPlan, label: 'Annual', price: '¥298/year', priceDisplay: '¥298/year' },
  { id: 'monthly' as SubscriptionPlan, label: 'Monthly', price: '¥38/month', priceDisplay: '¥38/month' },
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-lg bg-[#f5f5f5] rounded-t-3xl animate-slide-up safe-area-bottom"
        style={{ maxHeight: '90vh' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors z-10"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="px-6 pt-8 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 40px)' }}>
          {/* Creator Avatar */}
          <div className="flex justify-center mb-6">
            <img
              src={creatorAvatar}
              alt={channel.creatorName}
              className="w-24 h-24 rounded-2xl object-cover shadow-lg"
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Subscribe to {channel.name}
          </h2>
          <p className="text-center text-gray-500 mb-6 px-4">
            Consider supporting {channel.name} by choosing a paid subscription.
          </p>

          {/* Plan Selection Card */}
          <div className="bg-white rounded-2xl p-1 mb-6 shadow-sm">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className="w-full flex items-center justify-between px-5 py-4 transition-colors"
              >
                <div className="flex items-baseline gap-2">
                  <span className={`font-semibold ${selectedPlan === plan.id ? 'text-gray-900' : 'text-gray-600'}`}>
                    {plan.label}
                  </span>
                  <span className={`${selectedPlan === plan.id ? 'text-gray-700' : 'text-gray-400'}`}>
                    {plan.priceDisplay}
                  </span>
                </div>
                <div 
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedPlan === plan.id 
                      ? 'bg-orange-500 border-orange-500' 
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selectedPlan === plan.id && (
                    <Check size={14} className="text-white" strokeWidth={3} />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Benefits List */}
          <div className="space-y-3 mb-8 px-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Check size={18} className="text-orange-500" strokeWidth={2.5} />
                </div>
                <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Subscribe Button */}
          <Button
            onClick={handleSubscribe}
            className="w-full h-14 rounded-xl text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
          >
            Subscribe • {currentPlan?.priceDisplay}
          </Button>

          {/* Alternative option */}
          <p className="text-center text-gray-400 text-sm mt-4">
            Or, continue with in-app payment (¥388/year)
          </p>
        </div>
      </div>
    </div>
  );
};
