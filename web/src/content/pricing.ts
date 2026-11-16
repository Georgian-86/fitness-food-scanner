// DRAFT pricing. The owner approved these as draft numbers for the landing page; they can change before launch.
// Keep every price on the page reading from here.

export type Plan = {
  id: 'free' | 'pro'
  name: string
  price: string
  period: string
  blurb: string
  features: string[]
  founding?: { price: string; period: string; note: string }
  cta: string
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    blurb: 'Everything you need to check a product against your goal.',
    features: ['Unlimited scans', 'Colour verdict for your goal', 'One reason line on every scan', 'Protein per ₹100'],
    cta: 'Get early access',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹99',
    period: '/month',
    blurb: 'Extras for people who shop with a plan.',
    features: [
      'Everything in Free',
      'Two better swaps per scan',
      'Weekly goal report',
      'Quick-commerce link and screenshot checks',
      'WhatsApp bot',
      'Family profiles',
    ],
    founding: { price: '₹49', period: '/month', note: 'Founding member: ₹49/month, locked for life' },
    cta: 'Get early access',
  },
]

export const PRICING_NOTE = 'Prices are draft — founding members get notified first.'
