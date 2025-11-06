'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Translation } from '@/features/i18n';
import { UserError } from '@/lib/centra/errors';
import { CentraPaymentResponseEvent } from '@/lib/centra/events';
import { PaymentEvent } from '@/lib/centra/types/events';
import { checkUnavailableItems } from '@/lib/utils/unavailableItems';
import { PaymentMethodKind } from '@gql/graphql';

import { usePaymentInstructions } from '../../mutations';
import { checkoutQuery } from '../../queries';
import { showItemsRemovedToast } from '../../utils/showItemsRemovedToast';
import { Widget } from '../Widget';

// Payment methods to display as quick checkout
const QUICK_PAYMENT_METHODS: PaymentMethodKind[] = [
  PaymentMethodKind.StripePaymentIntents,
  PaymentMethodKind.PaypalCommerce,
];

export const InitiateOnlyPayments = () => {
  const { data } = useSuspenseQuery(checkoutQuery);

  const { shippingAddress, separateBillingAddress: billingAddress } = data.checkout;
  const country = shippingAddress.country?.code;
  const state = shippingAddress.state?.code;

  const router = useRouter();
  const { mutate: getPaymentInstructions } = usePaymentInstructions();
  const [formHtml, setFormHtml] = useState<string | null>(null);

  const paymentMethods = useMemo(() => {
    return QUICK_PAYMENT_METHODS.map((method) => {
      return data.checkout.paymentMethods.find(
        ({ kind, initiateOnlySupported }) => kind === method && initiateOnlySupported,
      );
    }).filter((method) => !!method);
  }, [data.checkout.paymentMethods]);

  const handlePaymentCallback = useEffectEvent(({ detail }: PaymentEvent) => {
    const method = paymentMethods.find(({ id, uri }) => detail.paymentMethod === uri || detail.paymentMethod === id);

    if (!method) {
      return;
    }

    getPaymentInstructions(
      {
        paymentFailedPage: `${window.location.origin}/failed`,
        paymentReturnPage: `${window.location.origin}/success`,
        paymentMethod: method.id,
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
            document.dispatchEvent(new CentraPaymentResponseEvent(paymentAction.formFields));
          } else {
            if (!paymentAction) {
              throw new Error('No payment action');
            }

            if (paymentAction.__typename === 'SuccessPaymentAction') {
              router.push('/confirmation');
            } else if (paymentAction.__typename === 'RedirectPaymentAction') {
              location.href = paymentAction.url;
            } else if (paymentAction.__typename === 'JavascriptPaymentAction') {
              setFormHtml(`<script>${paymentAction.script}</script>`);
            } else if (paymentAction.__typename === 'FormPaymentAction') {
              setFormHtml(paymentAction.html);
            } else {
              throw new Error('Unknown payment action');
            }
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

  if (!country) {
    return null;
  }

  return (
    <>
      {paymentMethods.map((method) => (
        <InitiateOnlyPayment key={method.id} id={method.id} country={country} state={state} />
      ))}
      {formHtml && <Widget html={formHtml} />}
    </>
  );
};

const InitiateOnlyPayment = ({ id, country, state }: { id: number; country: string; state: string | undefined }) => {
  const { mutate: getPaymentInstructions } = usePaymentInstructions();
  const [widget, setWidget] = useState<string | null>(null);

  useEffect(() => {
    getPaymentInstructions(
      {
        paymentFailedPage: `${window.location.origin}/failed`,
        paymentReturnPage: `${window.location.origin}/success`,
        paymentInitiateOnly: true,
        paymentMethod: id,
        shippingAddress: {
          country,
          state,
        },
      },
      {
        onSuccess: (data) => {
          if (data.action && 'formType' in data.action) {
            setWidget(data.action.html);
          } else {
            throw new Error('No payment action or unsupported action type');
          }
        },
        onError: (error) => {
          if (error instanceof UserError && checkUnavailableItems(error.userErrors)) {
            showItemsRemovedToast();
          }
        },
      },
    );
  }, [country, getPaymentInstructions, id, state]);

  if (widget) {
    return <Widget html={widget} />;
  }
};
