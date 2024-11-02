export interface StripeSubscription {
  id: string;
  customerId: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  planId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  quantity: number;
  items: StripeSubscriptionItem[];
  defaultPaymentMethod?: string;
  latestInvoice?: string;
}

export interface StripeSubscriptionItem {
  id: string;
  priceId: string;
  quantity: number;
}

export interface StripePlan {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export interface StripePaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  billingDetails: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  };
}

export interface StripeInvoice {
  id: string;
  customerId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  dueDate?: Date;
  paidAt?: Date;
  hostedInvoiceUrl?: string;
  items: StripeInvoiceItem[];
}

export interface StripeInvoiceItem {
  description: string;
  amount: number;
  quantity: number;
}