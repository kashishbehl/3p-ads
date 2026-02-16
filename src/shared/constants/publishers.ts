export const PUBLISHERS = [
  { id: 'pub_razorpay_checkout', name: 'Razorpay Checkout' },
  { id: 'pub_razorpay_payment_pages', name: 'Razorpay Payment Pages' },
  { id: 'pub_razorpay_pos', name: 'Razorpay POS' },
  { id: 'pub_razorpay_links', name: 'Razorpay Payment Links' },
] as const;

export type Publisher = (typeof PUBLISHERS)[number];
