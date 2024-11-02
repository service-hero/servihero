export const STRIPE_PLANS = {
  BASIC: {
    id: 'price_basic',
    name: 'Basic',
    description: 'Perfect for small teams',
    amount: 49,
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Up to 5 team members',
      'Basic pipeline management',
      'Contact management',
      'Email integration'
    ]
  },
  PROFESSIONAL: {
    id: 'price_professional',
    name: 'Professional',
    description: 'For growing businesses',
    amount: 99,
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Up to 20 team members',
      'Advanced pipeline features',
      'Marketing automation',
      'API access',
      'Priority support'
    ]
  },
  ENTERPRISE: {
    id: 'price_enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    amount: 299,
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Unlimited team members',
      'Custom integrations',
      'Dedicated account manager',
      'SLA support',
      'Advanced analytics',
      'Custom reporting'
    ]
  }
} as const;