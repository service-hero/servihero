import React from 'react';
import { Check } from 'lucide-react';
import { STRIPE_PLANS } from '../../services/stripe/config';
import { StripeService } from '../../services/stripe/StripeService';

export default function PricingPlans() {
  const handleSubscribe = async (priceId: string) => {
    try {
      await StripeService.createCheckoutSession(priceId);
    } catch (error) {
      console.error('Failed to start subscription:', error);
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0">
          {Object.values(STRIPE_PLANS).map((plan) => (
            <div
              key={plan.id}
              className="divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="p-6">
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                  {plan.name}
                </h2>
                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    ${plan.amount}
                  </span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className="mt-8 block w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Subscribe to {plan.name}
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h3 className="text-sm font-medium text-gray-900">
                  What's included
                </h3>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <Check
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}