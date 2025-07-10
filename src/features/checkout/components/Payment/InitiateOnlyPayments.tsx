'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Translation } from '@/features/i18n';
import { UserError } from '@/lib/centra/errors';
import { CentraPaymentResponseEvent, mapAddress } from '@/lib/centra/events';
import { PaymentEvent } from '@/lib/centra/types/events';
import { checkUnavailableItems } from '@/lib/utils/unavailableItems';
import { PaymentMethodKind } from '@gql/graphql';

import { usePaymentInstructions } from '../../mutations';
import { checkoutQuery } from '../../queries';
import { showItemsRemovedToast } from '../../utils/showItemsRemovedToast';
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

    paymentInstructionsMutation
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
        } else {
          throw new Error('No payment action or unsupported action type');
        }
      })
      .catch((error: unknown) => {
        console.error(`Could not initiate payment method ${id}`, error);
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
          onError: (error) => {
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
