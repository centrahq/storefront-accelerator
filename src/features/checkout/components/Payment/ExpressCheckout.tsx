'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import type { CheckoutData } from '../../service';
import { ExpressCheckoutErrorBoundary } from './ExpressCheckoutErrorBoundary';

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
  /** Checkout's own selection; the cart and product page leave it out and the wallet reads the bag. */
  selection?: CheckoutData;
}

const AdyenWallet = dynamic(() => import('./ExpressWallet/AdyenWallet').then((m) => ({ default: m.AdyenWallet })), {
  ssr: false,
});

const StripeWallet = dynamic(() => import('./ExpressWallet/StripeWallet').then((m) => ({ default: m.StripeWallet })), {
  ssr: false,
});

export const ExpressCheckout = ({ itemId, cartTotal, initialLineItems, disabled, market, selection }: Props) => {
  const productName = initialLineItems[0]?.name ?? '';
  // On a product page the wallet adds this product when engaged, and prices it into the sheet until then.
  const product = useMemo(
    () => (itemId ? { itemId, name: productName, price: cartTotal } : undefined),
    [cartTotal, itemId, productName],
  );

  if (disabled) {
    return null;
  }

  const Wallet =
    process.env.NEXT_PUBLIC_EXPRESS_CHECKOUT === 'stripe'
      ? StripeWallet
      : process.env.NEXT_PUBLIC_EXPRESS_CHECKOUT === 'adyen'
        ? AdyenWallet
        : null;

  return Wallet ? (
    <ExpressCheckoutErrorBoundary>
      <Wallet key={market} product={product} selection={selection} />
    </ExpressCheckoutErrorBoundary>
  ) : null;
};
