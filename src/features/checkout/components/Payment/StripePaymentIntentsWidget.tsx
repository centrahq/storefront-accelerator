'use client';

import { parseStripePaymentAction, type StripePaymentIntentsConfig } from '@centra/stripe/payment-intents';
import { StripePaymentMethodElement } from '@centra/stripe-react/payment-intents';
import { useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { UserError } from '@/lib/centra/errors';
import { checkUnavailableItems } from '@/lib/utils/unavailableItems';

import { usePaymentInstructions } from '../../mutations';
import { paymentOperations } from '../../paymentOperations';
import { checkoutQuery } from '../../queries';
import { showItemsRemovedToast } from '../../utils/showItemsRemovedToast';

type WidgetState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; config: StripePaymentIntentsConfig };

/**
 * Stripe's Payment Element for Centra's Stripe Payment Intents method.
 *
 * The store starts the payment, so the selection it keeps stays current. `@centra/stripe-react` confirms with
 * Stripe, then hands the result to Centra in place; a method that leaves the page comes back through `/success`.
 */
export const StripePaymentIntentsWidget = ({ id }: { id: number }) => {
  const { data } = useSuspenseQuery(checkoutQuery);
  const { mutate: getPaymentInstructions } = usePaymentInstructions();
  const { t } = useTranslation(['checkout']);
  const router = useRouter();
  const [widgetState, setWidgetState] = useState<WidgetState>({ status: 'loading' });
  const mutationFiredRef = useRef(false);

  const { shippingAddress, separateBillingAddress: billingAddress } = data.checkout;

  useEffect(() => {
    if (widgetState.status !== 'loading' || mutationFiredRef.current) {
      return;
    }
    mutationFiredRef.current = true;

    getPaymentInstructions(
      {
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
      },
      {
        onSuccess: (responseData) => {
          const config = parseStripePaymentAction(responseData.action);

          setWidgetState(config ? { status: 'ready', config } : { status: 'error' });
        },
        onError: (error) => {
          if (error instanceof UserError && checkUnavailableItems(error.userErrors)) {
            showItemsRemovedToast();
          } else {
            setWidgetState({ status: 'error' });
          }
        },
      },
    );
  }, [billingAddress, getPaymentInstructions, id, shippingAddress, widgetState.status]);

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
    <StripePaymentMethodElement
      config={widgetState.config}
      confirmation={{ checkout: data.checkout }}
      operations={paymentOperations}
      onOutcome={(outcome) => {
        if (outcome.status === 'completed') {
          router.push('/confirmation');
        }
      }}
    >
      {(payment) => {
        const failure = payment.outcome?.status === 'failed' ? payment.outcome : undefined;

        return (
          <div className="mt-6 flex flex-col gap-4">
            {payment.loadError || failure ? (
              <div role="alert" className="rounded border border-red-600 bg-red-50 p-4 text-sm text-red-800">
                <p>{failure?.message ?? t('checkout:something-went-wrong')}</p>
                {/* `unsafe`: Stripe may have taken the money, so the shopper isn't offered another try. */}
                {failure?.retry === 'unsafe' && <p>{t('checkout:payment-may-have-been-received')}</p>}
              </div>
            ) : null}
            <button
              type="button"
              disabled={!payment.canConfirm}
              onClick={() => {
                void payment.confirm();
              }}
              className={clsx(
                'bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase disabled:opacity-40',
                { 'animate-pulse': payment.isSubmitting },
              )}
            >
              {t('checkout:place-order')}
            </button>
          </div>
        );
      }}
    </StripePaymentMethodElement>
  );
};
