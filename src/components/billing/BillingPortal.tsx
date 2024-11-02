import React from 'react';
import { CreditCard, FileText, Settings } from 'lucide-react';
import { StripeService } from '../../services/stripe/StripeService';
import type { StripeSubscription, StripePaymentMethod, StripeInvoice } from '../../types/billing';

interface BillingPortalProps {
  subscription?: StripeSubscription;
  paymentMethod?: StripePaymentMethod;
  invoices: StripeInvoice[];
}

export default function BillingPortal({ 
  subscription, 
  paymentMethod, 
  invoices 
}: BillingPortalProps) {
  const handleManageSubscription = async () => {
    try {
      const portalUrl = await StripeService.createPortalSession();
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Failed to open billing portal:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subscription Overview */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Subscription
          </h3>
          {subscription ? (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {subscription.status.charAt(0).toUpperCase() + 
                     subscription.status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Next billing date</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              No active subscription
            </p>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Payment Method
            </h3>
            {paymentMethod && (
              <CreditCard className="h-5 w-5 text-gray-400" />
            )}
          </div>
          {paymentMethod ? (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                {paymentMethod.card.brand.charAt(0).toUpperCase() + 
                 paymentMethod.card.brand.slice(1)} ending in {paymentMethod.card.last4}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Expires {paymentMethod.card.expMonth}/{paymentMethod.card.expYear}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              No payment method on file
            </p>
          )}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Invoices
          </h3>
          <div className="mt-4 divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Invoice #{invoice.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(invoice.paidAt || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-900">
                    ${(invoice.amount / 100).toFixed(2)}
                  </span>
                  {invoice.hostedInvoiceUrl && (
                    <a
                      href={invoice.hostedInvoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manage Subscription Button */}
      <div className="flex justify-end">
        <button
          onClick={handleManageSubscription}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage Subscription
        </button>
      </div>
    </div>
  );
}