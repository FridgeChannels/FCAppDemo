'use client';

import { useState } from 'react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  annualPrice?: string;
  monthlyPrice?: string;
}

type SubscriptionPlan = 'annual' | 'monthly' | 'none';

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
  annualPrice = '€50/year',
  monthlyPrice = '€5/month',
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('annual');

  if (!isOpen) return null;

  const handleSubscribe = () => {
    // Mock: 模拟付费成功
    onSubscribe();
  };

  const getPlanPrice = () => {
    switch (selectedPlan) {
      case 'annual':
        return annualPrice;
      case 'monthly':
        return monthlyPrice;
      default:
        return 'Free';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-gray-100 rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out max-h-[90vh] overflow-y-auto"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          fontFamily: '__saans_cd5095',
        }}
      >
        <div className="px-4 sm:px-6 py-4 sm:py-6 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 touch-manipulation"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Profile picture */}
          {/* <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden border border-gray-300">
              
              <div className="w-full h-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none" className="sm:w-10 sm:h-10">
                  <circle cx="20" cy="15" r="6" fill="#9CA3AF" />
                  <path
                    d="M10 32C10 27 14 23 20 23C26 23 30 27 30 32"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div> */}

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-1.5 sm:mb-2 break-words px-2">
            Subscribe to Design + AI
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 text-center mb-4 sm:mb-6 break-words px-2">
            Consider supporting Design + AI by choosing a paid subscription.
          </p>

          {/* Subscription options */}
          <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
            {/* Annual */}
            <label
              className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border cursor-pointer transition-all min-h-[60px] sm:min-h-0 ${selectedPlan === 'annual'
                ? 'border-red-500 bg-white'
                : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <div className="flex-1 min-w-0 mr-2">
                <div className="font-medium text-gray-900 text-sm sm:text-base break-words">Annual</div>
                <div className="text-xs sm:text-sm text-gray-600 break-words">{annualPrice}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPlan === 'annual' ? 'border-red-500' : 'border-gray-300'
                }`}>
                {selectedPlan === 'annual' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                )}
              </div>
              <input
                type="radio"
                name="subscription"
                value="annual"
                checked={selectedPlan === 'annual'}
                onChange={() => setSelectedPlan('annual')}
                className="sr-only"
              />
            </label>

            {/* Monthly */}
            <label
              className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border cursor-pointer transition-all min-h-[60px] sm:min-h-0 ${selectedPlan === 'monthly'
                ? 'border-red-500 bg-white'
                : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <div className="flex-1 min-w-0 mr-2">
                <div className="font-medium text-gray-900 text-sm sm:text-base break-words">Monthly</div>
                <div className="text-xs sm:text-sm text-gray-600 break-words">{monthlyPrice}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPlan === 'monthly' ? 'border-red-500' : 'border-gray-300'
                }`}>
                {selectedPlan === 'monthly' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                )}
              </div>
              <input
                type="radio"
                name="subscription"
                value="monthly"
                checked={selectedPlan === 'monthly'}
                onChange={() => setSelectedPlan('monthly')}
                className="sr-only"
              />
            </label>

            {/* None Free */}
            <label
              className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border cursor-pointer transition-all min-h-[60px] sm:min-h-0 ${selectedPlan === 'none'
                ? 'border-red-500 bg-white'
                : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <div className="flex-1 min-w-0 mr-2">
                <div className="font-medium text-gray-900 text-sm sm:text-base break-words">None</div>
                <div className="text-xs sm:text-sm text-gray-600 break-words">Free</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPlan === 'none' ? 'border-red-500' : 'border-gray-300'
                }`}>
                {selectedPlan === 'none' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                )}
              </div>
              <input
                type="radio"
                name="subscription"
                value="none"
                checked={selectedPlan === 'none'}
                onChange={() => setSelectedPlan('none')}
                className="sr-only"
              />
            </label>
          </div>

          {/* Benefits list */}
          <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                className="flex-shrink-0 mt-0.5 sm:w-5 sm:h-5"
              >
                <circle cx="10" cy="10" r="9" fill="#DC2626" />
                <path
                  d="M6 10L9 13L14 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs sm:text-sm text-gray-700 break-words">Occasional public posts</span>
            </div>
            <div className="flex items-start gap-2.5 sm:gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                className="flex-shrink-0 mt-0.5 sm:w-5 sm:h-5"
              >
                <circle cx="10" cy="10" r="9" fill="#DC2626" />
                <path
                  d="M6 10L9 13L14 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs sm:text-sm text-gray-700 break-words">
                Subscriber-only posts and full archive
              </span>
            </div>
            <div className="flex items-start gap-2.5 sm:gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                className="flex-shrink-0 mt-0.5 sm:w-5 sm:h-5"
              >
                <circle cx="10" cy="10" r="9" fill="#DC2626" />
                <path
                  d="M6 10L9 13L14 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs sm:text-sm text-gray-700 break-words">
                Post comments and join the community
              </span>
            </div>
            <div className="flex items-start gap-2.5 sm:gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                className="flex-shrink-0 mt-0.5 sm:w-5 sm:h-5"
              >
                <circle cx="10" cy="10" r="9" fill="#DC2626" />
                <path
                  d="M6 10L9 13L14 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs sm:text-sm text-gray-700 break-words">
                Getting your questions answered directly by me via chat threads
              </span>
            </div>
          </div>

          {/* Subscribe button */}
          <button
            onClick={handleSubscribe}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors touch-manipulation min-h-[44px] text-sm sm:text-base"
          >
            Subscribe • {getPlanPrice()}
          </button>
        </div>
      </div>
    </>
  );
};

