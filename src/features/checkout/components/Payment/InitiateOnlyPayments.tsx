'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { CentraPaymentResponseEvent, mapAddress } from '@/lib/centra/events';
import { PaymentEvent } from '@/lib/centra/types/events';
import { PaymentMethodKind } from '@gql/graphql';

import { usePaymentInstructions } from '../../mutations';
import { checkoutQuery } from '../../queries';
import { handlePaymentError } from '../../utils/handlePaymentError';
import { Widget } from '../Widget';

// Payment methods to display as quick checkout
const initOnlyPaymentMethods: PaymentMethodKind[] = [];

export const InitiateOnlyPayments = () => {
  const { data } = useSuspenseQuery(checkoutQuery);

  const { paymentMethods, shippingAddress } = data.checkout;
  const country = shippingAddress.country?.code;

  if (country) {
    return (
      <>
        {paymentMethods
          .filter((method) => method.initiateOnlySupported && initOnlyPaymentMethods.includes(method.kind))
          .map((method) => (
            <InitiateOnlyPayment key={method.id} id={method.id} uri={method.uri} />
          ))}
      </>
    );
  }
};

export const InitiateOnlyPayment = ({ id, uri }: { id: number; uri: string }) => {
  const { data } = useSuspenseQuery(checkoutQuery);
  const router = useRouter();
  const paymentInstructionsMutation = usePaymentInstructions();
  const [widget, setWidget] = useState('');
  const hasInitiated = useRef(false);

  const { shippingAddress, separateBillingAddress: billingAddress } = data.checkout;
  const country = shippingAddress.country?.code;
  const state = shippingAddress.state?.code;

  useEffect(() => {
    if (!country || hasInitiated.current) {
      return;
    }

    hasInitiated.current = true;

    void paymentInstructionsMutation
      .mutateAsync({
        paymentFailedPage: `${window.location.origin}/failed`,
        paymentReturnPage: `${window.location.origin}/success`,
        paymentInitiateOnly: true,
        paymentMethod: id,
        shippingAddress: {
          country,
          state,
        },
      })
      .then((data) => {
        if (data.action && 'formType' in data.action) {
          setWidget(data.action.html);
        }
      });
  }, [country, id, paymentInstructionsMutation, state]);

  useEffect(() => {
    const handlePaymentCallback = ({ detail }: PaymentEvent) => {
      // TODO: Remove after https://centracommerce.atlassian.net/browse/DT-951
      if (detail.paymentMethod !== uri && detail.paymentMethod !== id) {
        return;
      }

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
          paymentMethod: id,
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
                eval(paymentAction.script);
              } else if (paymentAction.__typename === 'FormPaymentAction') {
                setWidget(paymentAction.html);
              } else {
                throw new Error('Unknown payment action');
              }
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
  }, [billingAddress, id, router, shippingAddress, paymentInstructionsMutation, uri]);

  if (!widget) {
    return null;
  }

  return <Widget html={widget} />;
};
