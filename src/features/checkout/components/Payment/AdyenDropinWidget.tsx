'use client';

import '@adyen/adyen-web/styles/adyen.css';

import { ApplePay, Card, GooglePay, Klarna, PayPal } from '@adyen/adyen-web';
import { type AdyenDropinConfig, parseAdyenDropinAction } from '@centra/adyen/drop-in';
import { AdyenDropinElement } from '@centra/adyen-react/drop-in';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { UserError } from '@/lib/centra/errors';
import { checkUnavailableItems } from '@/lib/utils/unavailableItems';

import { usePaymentInstructions } from '../../mutations';
import { paymentOperations } from '../../paymentOperations';
import { checkoutQuery } from '../../queries';
import { showItemsRemovedToast } from '../../utils/showItemsRemovedToast';

/**
 * The methods Drop-in may show. Adyen's tree-shakable build renders only the components it is given, so this list is
 * also what the checkout bundle carries; a method the Adyen account doesn't enable simply never shows.
 */
const PAYMENT_METHOD_COMPONENTS = [ApplePay, Card, GooglePay, Klarna, PayPal];

type WidgetState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; config: AdyenDropinConfig };

/**
 * Adyen's Drop-in for Centra's Adyen Drop-in method.
 *
 * The store starts the payment, so the selection it keeps stays current. Drop-in then submits its own
 * `paymentInstructions` call with the same input, which Centra takes as the same payment, and `@centra/adyen-react`
 * handles 3D Secure in place; a method that leaves the page comes back through `/success`.
 */
export const AdyenDropinWidget = ({ id }: { id: number }) => {
  const { data } = useSuspenseQuery(checkoutQuery);
  const { mutate: getPaymentInstructions } = usePaymentInstructions();
  const { t } = useTranslation(['checkout']);
  const router = useRouter();
  const [widgetState, setWidgetState] = useState<WidgetState>({ status: 'loading' });
  const mutationFiredRef = useRef(false);

  const { shippingAddress, separateBillingAddress: billingAddress } = data.checkout;

  // One input for both calls: Centra matches Drop-in's submit to the payment this started.
  const input = useMemo(
    () => ({
      paymentFailedPage: `${window.location.origin}/failed`,
      paymentReturnPage: `${window.location.origin}/success`,
      paymentMethod: id,
      shippingAddress: {
        ...shippingAddress,
        country: shippingAddress.country?.code ?? '',
        state: shippingAddress.state?.code,
      },
      separateBillingAddress: billingAddress
        ? {
            ...billingAddress,
            country: billingAddress.country?.code ?? '',
            state: billingAddress.state?.code,
          }
        : null,
    }),
    [billingAddress, id, shippingAddress],
  );

  useEffect(() => {
    if (widgetState.status !== 'loading' || mutationFiredRef.current) {
      return;
    }
    mutationFiredRef.current = true;

    getPaymentInstructions(input, {
      onSuccess: (responseData) => {
        const config = parseAdyenDropinAction(responseData.action);

        setWidgetState(config ? { status: 'ready', config } : { status: 'error' });
      },
      onError: (error) => {
        if (error instanceof UserError && checkUnavailableItems(error.userErrors)) {
          showItemsRemovedToast();
        } else {
          setWidgetState({ status: 'error' });
        }
      },
    });
  }, [getPaymentInstructions, input, widgetState.status]);

  if (widgetState.status === 'loading') {
    return (
      <div className="flex min-h-24 w-full items-center justify-center">
        <div className="text-mono-800 size-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (widgetState.status === 'error') {
    return (
      <p className="rounded border border-red-600 bg-red-50 p-4 text-sm text-red-800">
        {t('checkout:something-went-wrong')}
      </p>
    );
  }

  return (
    <AdyenDropinElement
      config={widgetState.config}
      instructions={{ ...input, termsAndConditions: true }}
      operations={paymentOperations}
      paymentMethodComponents={PAYMENT_METHOD_COMPONENTS}
      onOutcome={(outcome) => {
        if (outcome.status === 'completed') {
          router.push('/confirmation');
        } else if (outcome.status === 'centra-action') {
          // Centra continues the payment elsewhere; one this page can't follow reloads it, so Centra's state decides.
          if (outcome.action.url) {
            location.href = outcome.action.url;
          } else {
            location.reload();
          }
        }
      }}
    >
      {(dropin) => {
        const failure = dropin.outcome?.status === 'failed' ? dropin.outcome : undefined;

        return dropin.loadError || failure ? (
          <div role="alert" className="mt-4 rounded border border-red-600 bg-red-50 p-4 text-sm text-red-800">
            <p>{failure?.message ?? t('checkout:something-went-wrong')}</p>
            {/* `unsafe`: Adyen may have taken the money, so the shopper isn't offered another try. */}
            {failure?.retry === 'unsafe' && <p>{t('checkout:payment-may-have-been-received')}</p>}
          </div>
        ) : null;
      }}
    </AdyenDropinElement>
  );
};
