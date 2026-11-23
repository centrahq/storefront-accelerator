'use client';

import { toStripeMinorUnits } from '@centra/stripe/express';
import { StripeExpressCheckout, type StripeExpressSummary } from '@centra/stripe-react/express';
import { useMemo } from 'react';

import { PaymentMethodKind } from '@gql/graphql';

import type { CheckoutData } from '../../../service';
import { useExpressWallet } from './useExpressWallet';
import { type PendingProduct, toWalletLines, type WalletSelection } from './walletSelection';

/**
 * Stripe bills in its own minor units, which can differ from Centra's denominator, so every amount goes through
 * `toStripeMinorUnits`. Centra's widget query wants the lines back in major units, as strings.
 */
function summarize(selection: WalletSelection | null, pending?: PendingProduct): StripeExpressSummary {
  const { currency, lines, shippingMethods, total } = toWalletLines(selection, pending);

  return {
    amount: toStripeMinorUnits(total, currency.code),
    configurationLineItems: lines.map((line) => ({ name: line.name, price: String(line.value) })),
    currency: currency.code,
    lineItems: lines.map((line) => ({ amount: toStripeMinorUnits(line.value, currency.code), name: line.name })),
    shippingRates: shippingMethods.map((method) => ({
      amount: toStripeMinorUnits(method.value, currency.code),
      displayName: method.name,
      id: method.id,
    })),
  };
}

export const StripeWallet = ({ product, selection }: { product?: PendingProduct; selection?: CheckoutData }) => {
  const wallet = useExpressWallet({ kind: PaymentMethodKind.StripePaymentIntents, product, selection });
  const summary = useMemo(() => summarize(wallet.selection, product), [product, wallet.selection]);

  return (
    <StripeExpressCheckout<WalletSelection | null, unknown>
      checkout={wallet.checkout}
      item={wallet.item}
      onOutcome={wallet.onOutcome}
      // The wallet answers the sheet from this selection itself; the store's cache is read again once it closes.
      onSelectionChange={() => undefined}
      operations={wallet.operations}
      paymentMethodId={wallet.paymentMethodId}
      renderError={({ message }) => (
        <p role="status" className="text-sm text-red-800">
          {message}
        </p>
      )}
      summarizeSelection={summarize}
      summary={summary}
    />
  );
};
