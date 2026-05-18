'use client';

import dynamic from 'next/dynamic';

import { paymentConfig } from '../../config/payment';

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

const AdyenExpressCheckout = dynamic(
  () => import('./AdyenExpressCheckout/AdyenExpressCheckout').then((m) => ({ default: m.AdyenExpressCheckout })),
  { ssr: false },
);

const StripeExpressCheckout = dynamic(
  () => import('./StripeExpressCheckout/StripeExpressCheckout').then((m) => ({ default: m.StripeExpressCheckout })),
  { ssr: false },
);

export const ExpressCheckout = (props: Props) => {
  if (paymentConfig.expressCheckout === 'stripe') {
    return <StripeExpressCheckout key={props.market} {...props} />;
  }
  if (paymentConfig.expressCheckout === 'adyen') {
    return <AdyenExpressCheckout key={props.market} {...props} />;
  }
  return null;
};
