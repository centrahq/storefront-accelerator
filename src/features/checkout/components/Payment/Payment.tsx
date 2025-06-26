'use client';

import { useIsMutating, useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Trans } from '@/features/i18n';
import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { CentraPaymentResponseEvent, mapAddress } from '@/lib/centra/events';
import { PaymentEvent } from '@/lib/centra/types/events';
import { PaymentInstructionsMutation } from '@gql/graphql';

import { usePaymentInstructions } from '../../mutations';
import { checkoutQuery } from '../../queries';
import { handlePaymentError } from '../../utils/handlePaymentError';
import { Widget } from '../Widget';
import { KlarnaPayments } from './KlarnaPayments';
import { PaymentMethodField } from './PaymentMethodField';

export const Payment = () => {
  const [paymentWidget, setPaymentWidget] = useState<ReactNode>(null);
  const router = useRouter();
  const { t } = useTranslation(['checkout']);
  const { data } = useSuspenseQuery(checkoutQuery);
  const paymentInstructionsMutation = usePaymentInstructions();
  const isMutatingCheckout = useIsMutating({ mutationKey: ['checkout'] }) > 0;

  const { shippingAddress, separateBillingAddress: billingAddress, paymentMethod } = data.checkout;

  const handlePaymentAction = useCallback(
    (paymentAction: PaymentInstructionsMutation['paymentInstructions']['action']) => {
      if (!paymentAction) {
        throw new Error('No payment action');
      }

      if (paymentAction.__typename === 'SuccessPaymentAction') {
        // Payment is successful, redirect to confirmation page
        router.push(`/confirmation`);
      } else if (paymentAction.__typename === 'RedirectPaymentAction') {
        // Redirect to payment provider
        location.href = paymentAction.url;
      } else if (paymentAction.__typename === 'JavascriptPaymentAction') {
        // Execute payment action script
        eval(paymentAction.script);
      } else if (paymentAction.__typename === 'FormPaymentAction') {
        // Display payment widget
        if (paymentAction.formType === 'klarna-payments') {
          const formFields = paymentAction.formFields as { authorizePayload: string; client_token: string };
          setPaymentWidget(
            <KlarnaPayments authorizePayload={formFields.authorizePayload} clientToken={formFields.client_token} />,
          );
        } else {
          setPaymentWidget(<Widget html={paymentAction.html} />);
        }
      } else {
        throw new Error('Unknown payment action');
      }
    },
    [router],
  );

  const startPayment = () => {
    paymentInstructionsMutation.mutate(
      {
        paymentFailedPage: `${window.location.origin}/failed`,
        paymentReturnPage: `${window.location.origin}/success`,
        shippingAddress: {
          ...shippingAddress,
          country: shippingAddress.country?.code ?? '',
          state: shippingAddress.state?.code ?? '',
        },
        separateBillingAddress: billingAddress
          ? {
              ...billingAddress,
              country: billingAddress.country?.code ?? '',
              state: billingAddress.state?.code ?? '',
            }
          : null,
      },
      {
        onSuccess: (data) => handlePaymentAction(data.action),
        onError: handlePaymentError,
      },
    );
  };

  useEffect(() => {
    // Get payment instructions when a payment widget needs to
    const handlePaymentCallback = ({ detail }: PaymentEvent) => {
      const shipping = detail.addressIncluded
        ? mapAddress(detail.shippingAddress)
        : {
            ...shippingAddress,
            country: shippingAddress.country?.code ?? '',
            state: shippingAddress.state?.code,
          };

      const billing = detail.addressIncluded
        ? mapAddress(detail.billingAddress)
        : {
            ...billingAddress,
            country: billingAddress?.country?.code ?? '',
            state: billingAddress?.state?.code,
          };

      paymentInstructionsMutation.mutate(
        {
          paymentFailedPage: `${window.location.origin}/failed`,
          paymentReturnPage: `${window.location.origin}/success`,
          paymentMethod: paymentMethod?.id,
          shippingAddress: shipping,
          separateBillingAddress: billing,
          paymentMethodSpecificFields: detail.paymentMethodSpecificFields,
        },
        {
          onSuccess: (data) => {
            const paymentAction = data.action;

            if (
              detail.responseEventRequired &&
              paymentAction?.__typename === 'JavascriptPaymentAction' &&
              paymentAction.formFields
            ) {
              // Let CentraCheckout handle it, if `responseEventRequired` is true.
              document.dispatchEvent(new CentraPaymentResponseEvent(paymentAction.formFields));
            } else {
              handlePaymentAction(paymentAction);
            }
          },
          onError: handlePaymentError,
        },
      );
    };

    document.addEventListener('centra_checkout_payment_callback', handlePaymentCallback);

    return () => {
      document.removeEventListener('centra_checkout_payment_callback', handlePaymentCallback);
    };
  }, [billingAddress, handlePaymentAction, paymentMethod?.id, shippingAddress, paymentInstructionsMutation]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-medium">{t('checkout:payment')}</h2>
        <p className="text-mono-500 text-sm">{t('checkout:secure-transactions')}</p>
      </div>
      {paymentWidget}
      {!paymentWidget && (
        <form action={startPayment} className="flex flex-col gap-5">
          <PaymentMethodField />
          <p className="text-mono-500 text-sm">
            <Trans t={t} i18nKey="checkout:terms">
              By clicking Proceed you agree to our
              <ShopLink href="/terms" target="_blank">
                terms and conditions
              </ShopLink>
            </Trans>
          </p>
          <button
            type="submit"
            className={clsx(
              'bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase',
              {
                'animate-pulse': isMutatingCheckout,
              },
            )}
            disabled={isMutatingCheckout}
          >
            {t('checkout:proceed')}
          </button>
        </form>
      )}
    </div>
  );
};
