'use client';

import '@adyen/adyen-web/styles/adyen.css';

import type { AdyenExpressSelectionSummary } from '@centra/adyen/express';
import { AdyenExpressCheckout } from '@centra/adyen-react/express';
import { useMemo } from 'react';

import { useTranslation } from '@/features/i18n/useTranslation/client';
import { PaymentMethodKind } from '@gql/graphql';

import type { CheckoutData } from '../../../service';
import { useExpressWallet } from './useExpressWallet';
import { type PendingProduct, toWalletLines, type WalletSelection } from './walletSelection';

/** Amounts stay in Centra's major units: `@centra/adyen` converts them with the currency's own denominator. */
function summarize(
  selection: WalletSelection | null,
  totalLabel: string,
  pending?: PendingProduct,
): AdyenExpressSelectionSummary {
  const { currency, lines, shippingMethods, total } = toWalletLines(selection, pending);

  return {
    currency,
    lineItems: lines.map((line) => ({ label: line.name, value: line.value })),
    shippingMethods: shippingMethods.map((method) => ({ id: method.id, label: method.name, value: method.value })),
    total,
    totalLabel,
  };
}

export const AdyenWallet = ({ product, selection }: { product?: PendingProduct; selection?: CheckoutData }) => {
  const { t } = useTranslation(['checkout']);
  const totalLabel = t('checkout:receipt.grand-total');
  const wallet = useExpressWallet({ kind: PaymentMethodKind.AdyenDropin, product, selection });
  const summary = useMemo(
    () => summarize(wallet.selection, totalLabel, product),
    [product, totalLabel, wallet.selection],
  );

  return (
    <AdyenExpressCheckout<WalletSelection | null, unknown>
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
      summarizeSelection={(next) => summarize(next, totalLabel)}
      summary={summary}
    />
  );
};
