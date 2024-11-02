import { loadStripe } from '@stripe/stripe-js';
import type { 
  StripeSubscription, 
  StripePaymentMethod, 
  StripeInvoice 
} from '../../types/billing';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export class StripeService {
  static async createSubscription(priceId: string, quantity: number = 1): Promise<StripeSubscription> {
    const response = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, quantity })
    });

    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }

    return response.json();
  }

  static async updateSubscription(
    subscriptionId: string,
    updates: { priceId?: string; quantity?: number }
  ): Promise<StripeSubscription> {
    const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    return response.json();
  }

  static async cancelSubscription(subscriptionId: string): Promise<StripeSubscription> {
    const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return response.json();
  }

  static async addPaymentMethod(paymentMethodId: string): Promise<StripePaymentMethod> {
    const response = await fetch('/api/payment-methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethodId })
    });

    if (!response.ok) {
      throw new Error('Failed to add payment method');
    }

    return response.json();
  }

  static async listInvoices(): Promise<StripeInvoice[]> {
    const response = await fetch('/api/invoices');

    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }

    return response.json();
  }

  static async createCheckoutSession(priceId: string): Promise<string> {
    const response = await fetch('/api/checkout-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw new Error(error.message);
    }

    return sessionId;
  }

  static async createPortalSession(): Promise<string> {
    const response = await fetch('/api/portal-sessions', {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    return url;
  }
}