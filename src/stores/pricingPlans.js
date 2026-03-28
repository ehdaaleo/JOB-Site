export const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams and startups testing the waters.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyPriceLabel: '$0',
    yearlyPriceLabel: '$0',
    cta: 'Get Started',
    popular: false,
    features: [
      { text: '3 Standard Job Posts', included: true },
      { text: 'Standard Support', included: true },
      { text: 'Featured Badge', included: false }
    ]
  },
  {
    id: 'pro',
    name: 'Business Pro',
    description: 'Tailored for growing companies with high-volume hiring.',
    monthlyPrice: 49,
    yearlyPrice: 480,
    monthlyPriceLabel: '$49',
    yearlyPriceLabel: '$480',
    cta: 'Select Pro',
    popular: true,
    features: [
      { text: '15 Featured Job Posts', included: true },
      { text: 'Direct Candidate Messaging', included: true },
      { text: 'Standard Support', included: true },
      { text: 'Featured Badge', included: true }
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Our most comprehensive solution for global teams.',
    monthlyPrice: 199,
    yearlyPrice: 1900,
    monthlyPriceLabel: '$199',
    yearlyPriceLabel: '$1,900',
    cta: 'Contact Sales',
    popular: false,
    features: [
      { text: 'Unlimited Everything', included: true },
      { text: 'Featured Badge', included: true },
      { text: 'Premium Data Reports', included: true },
      { text: 'Standard Support', included: true }
    ]
  }
]
