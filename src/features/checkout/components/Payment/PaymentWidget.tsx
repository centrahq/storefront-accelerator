import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useEffectEvent, useState } from 'react';
import { toast } from 'sonner';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Translation } from '@/features/i18n';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { UserError } from '@/lib/centra/errors';
import { CentraPaymentResponseEvent } from '@/lib/centra/events';
import { PaymentEvent } from '@/lib/centra/types/events';
import { checkUnavailableItems } from '@/lib/utils/unavailableItems';
import { PaymentInstructionsMutation } from '@gql/graphql';

import { usePaymentInstructions } from '../../mutations';
import { checkoutQuery } from '../../queries';
import { showItemsRemovedToast } from '../../utils/showItemsRemovedToast';
import { Widget } from '../Widget';
import { KlarnaPayments } from './KlarnaPayments';

type Status = { status: 'loading' } | { status: 'error' } | { status: 'success'; node: ReactNode };

export const PaymentWidget = ({ id, uri }: { id: number; uri: string }) => {
  const [widget, setWidget] = useState<Status>({ status: 'loading' });
  const router = useRouter();
  const { data } = useSuspenseQuery(checkoutQuery);
  const { mutate: getPaymentInstructions } = usePaymentInstructions();
  const { t } = useTranslation(['checkout']);

  const { shippingAddress, separateBillingAddress: billingAddress } = data.checkout;

  const handlePaymentAction = useEffectEvent(
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
        setWidget({ status: 'success', node: <Widget html={`<script>${paymentAction.script}</script>`} /> });
      } else if (paymentAction.__typename === 'FormPaymentAction') {
        // Display payment widget
        if (paymentAction.formType === 'klarna-payments') {
          const formFields = paymentAction.formFields as { authorizePayload: string; client_token: string };
          setWidget({
            status: 'success',
            node: (
              <KlarnaPayments authorizePayload={formFields.authorizePayload} clientToken={formFields.client_token} />
            ),
          });
        } else {
          setWidget({ status: 'success', node: <Widget html={paymentAction.html} /> });
        }
      } else {
        throw new Error('Unknown payment action');
      }
    },
  );

  useEffect(() => {
    if (widget.status !== 'loading') {
      return;
    }

    // Initialize payment widget
    getPaymentInstructions(
      {
        paymentFailedPage: `${window.location.origin}/failed`,
        paymentReturnPage: `${window.location.origin}/success`,
        paymentMethod: id,
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
        onError: (error) => {
          if (error instanceof UserError && checkUnavailableItems(error.userErrors)) {
            showItemsRemovedToast();
          } else {
            setWidget({ status: 'error' });
          }
        },
      },
    );
  }, [billingAddress, getPaymentInstructions, id, shippingAddress, widget.status]);

  const handlePaymentCallback = useEffectEvent(({ detail }: PaymentEvent) => {
    if (detail.paymentMethod !== id && detail.paymentMethod !== uri) {
      return;
    }

    getPaymentInstructions(
      {
        paymentFailedPage: `${window.location.origin}/failed`,
        paymentReturnPage: `${window.location.origin}/success`,
        paymentMethod: id,
        shippingAddress: detail.addressIncluded
          ? detail.shippingAddress
          : {
              ...shippingAddress,
              country: shippingAddress.country?.code ?? '',
              state: shippingAddress.state?.code,
            },
        separateBillingAddress: detail.addressIncluded
          ? detail.billingAddress
          : {
              ...billingAddress,
              country: billingAddress?.country?.code ?? '',
              state: billingAddress?.state?.code,
            },
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
            // If `responseEventRequired` is true, let CentraCheckout handle it.
            document.dispatchEvent(new CentraPaymentResponseEvent(paymentAction.formFields));
          } else {
            handlePaymentAction(paymentAction);
          }
        },
        onError: (error) => {
          if (detail.responseEventRequired) {
            document.dispatchEvent(new CentraPaymentResponseEvent(CentraPaymentResponseEvent.ERROR_PAYLOAD));
          }

          if (error instanceof UserError && checkUnavailableItems(error.userErrors)) {
            showItemsRemovedToast();
          } else {
            toast.error(<Translation>{(t) => t('checkout:errors.could-not-finalize-payment')}</Translation>, {
              id: 'payment-error',
            });
          }
        },
      },
    );
  });

  useEffect(() => {
    // Handle payment actions from CentraCheckout
    document.addEventListener('centra_checkout_payment_callback', handlePaymentCallback);

    return () => {
      document.removeEventListener('centra_checkout_payment_callback', handlePaymentCallback);
    };
  }, []);

  if (widget.status === 'loading') {
    return (
      <div className="flex min-h-24 w-full items-center justify-center">
        <div className="text-mono-800 size-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (widget.status === 'error') {
    return (
      <p className="rounded border border-red-600 bg-red-50 p-4 text-sm text-red-800">
        {t('checkout:something-went-wrong')}
      </p>
    );
  }

  return widget.node;
};
