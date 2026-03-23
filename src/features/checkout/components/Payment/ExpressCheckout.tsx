'use client';

import dynamic from 'next/dynamic';

interface Props {
  itemId?: string;
  cartTotal: number;
  initialLineItems: {
    name: string;
    price: string;
  }[];
  disabled?: boolean;
  language: string;
  market: number;
}

const provider = process.env.NEXT_PUBLIC_EXPRESS_CHECKOUT_PROVIDER;

const AdyenExpressCheckout = dynamic(
  () => import('./AdyenExpressCheckout/AdyenExpressCheckout').then((m) => ({ default: m.AdyenExpressCheckout })),
  { ssr: false },
);

const StripeExpressCheckout = dynamic(
  () => import('./StripeExpressCheckout/StripeExpressCheckout').then((m) => ({ default: m.StripeExpressCheckout })),
  { ssr: false },
);

export const ExpressCheckout = (props: Props) => {
  if (provider === 'adyen') return <AdyenExpressCheckout {...props} />;
  if (provider === 'stripe') return <StripeExpressCheckout {...props} />;
  return null;
};
