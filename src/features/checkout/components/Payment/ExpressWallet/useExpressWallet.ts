'use client';

import { toAddressInput } from '@centra/storefront';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { selectionQuery } from '@/features/cart/queries';
import { addToCart, updateLine } from '@/features/cart/service';
import { PaymentMethodKind } from '@gql/graphql';

import { expressCheckoutOperations, paymentOperations } from '../../../paymentOperations';
import { checkoutQuery, expressSelectionQuery } from '../../../queries';
import { CheckoutData, fetchExpressCheckout } from '../../../service';
import { type PendingProduct, toWalletSelection } from './walletSelection';

export interface ExpressWalletOptions {
  kind: PaymentMethodKind;
  /** Checkout's own selection, kept current by checkout. Without it the wallet reads the bag itself. */
  selection?: CheckoutData;
  /** On a product page, the product the wallet adds when engaged. */
  product?: PendingProduct;
}

/**
 * What the `@centra/*` wallets need from this store, the same for Stripe and Adyen.
 *
 * - The selection the sheet opens with and the payment method to pay with. Wallets answer the sheet from Centra's
 *   responses after that, never from this store's cache.
 * - The engage hook (`item.add`), run once when the shopper opens a sheet. It sets Centra's express-checkout context
 *   (`fetchExpressCheckout`, which Ingrid needs), and on a product page adds the product unless the bag holds it.
 * - Where the shopper goes after the payment, and a fresh read of the bag once a sheet closes without paying.
 */
export function useExpressWallet({ kind, selection, product }: ExpressWalletOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Outside checkout, the wallet reads the bag again whenever the cart changes it.
  const { data: cart } = useQuery({ ...selectionQuery, enabled: !selection });
  const bagKey = cart?.lines.map((line) => (line ? `${line.id}:${line.quantity}` : '')).join(',') ?? '';
  const { data: bag } = useQuery({ ...expressSelectionQuery(bagKey), enabled: !selection });
  const current = selection ?? bag ?? null;
  const walletSelection = useMemo(() => toWalletSelection(current), [current]);

  const paymentMethod = current?.checkout.paymentMethods.find(
    (method) => method.kind === kind && method.initiateOnlySupported,
  );
  const itemId = product?.itemId;

  const operations = useMemo(
    () => ({
      ...paymentOperations,
      getConfiguration: expressCheckoutOperations.getConfiguration,
      setShippingAddress: expressCheckoutOperations.setShippingAddress,
      setShippingMethod: expressCheckoutOperations.setShippingMethod,
    }),
    [],
  );

  const item = useMemo(
    () => ({
      add: async () => {
        const engaged = await fetchExpressCheckout();

        // Centra adds a repeat add to the shopper's own line, which `remove` would then delete.
        if (!itemId || engaged.lines.some((line) => line?.item.id === itemId)) {
          return null;
        }

        const added = await addToCart({ item: itemId });

        return added.lines.find((line) => line?.item.id === itemId)?.id ?? null;
      },
      remove: async (lineId: string) => {
        await updateLine({ id: lineId, quantity: 0 });
      },
    }),
    [itemId],
  );

  /** A sheet that closed without paying may have moved the bag, its addresses or Ingrid's context. */
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['express-selection'] });
    void queryClient.invalidateQueries(selectionQuery);
    void queryClient.invalidateQueries(checkoutQuery);
  };

  const onOutcome = (outcome: { status: string; action?: { url?: string | null } }) => {
    if (outcome.status === 'completed') {
      router.push('/confirmation');
    } else if (outcome.status === 'centra-action') {
      // Centra continues the payment elsewhere; one this page can't follow reloads it, so Centra's state decides.
      if (outcome.action?.url) {
        location.href = outcome.action.url;
      } else {
        location.reload();
      }
    } else {
      refresh();
    }
  };

  const shippingAddress = current?.checkout.shippingAddress;
  const separateBillingAddress = current?.checkout.separateBillingAddress;

  return {
    checkout: {
      paymentFailedPage: `${window.location.origin}/failed`,
      paymentReturnPage: `${window.location.origin}/success`,
      // What a dismissed sheet or a safe failure puts back, both as Centra holds them.
      shippingAddress: shippingAddress ? toAddressInput(shippingAddress) : null,
      separateBillingAddress: separateBillingAddress ? toAddressInput(separateBillingAddress) : null,
      // The sheet has no terms box, and the store's own payments accept the terms on the shopper's behalf too.
      termsAndConditions: true,
    },
    item,
    onOutcome,
    operations,
    paymentMethodId: paymentMethod?.id,
    selection: walletSelection,
  };
}
