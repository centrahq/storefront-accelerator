'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

export const InitiateOnlyPayments = ({ countriesWithStates }: { countriesWithStates: string[] }) => {
  const { data } = useSuspenseQuery(checkoutQuery);

  const { paymentMethods, shippingAddress } = data.checkout;
  const country = shippingAddress.country?.code;
  const state = shippingAddress.state?.code;

  if (country && (!countriesWithStates.includes(country) || state)) {
    return (
      <>
        {QUICK_PAYMENT_METHODS.map((kind) => {
          const method = paymentMethods.find((method) => method.kind === kind);

          if (method) {
            return <InitiateOnlyPayment key={method.id} id={method.id} uri={method.uri} />;
          }
        })}
      </>
    );
  }
};

export const InitiateOnlyPayment = ({ id, uri }: { id: number; uri: string }) => {
  const { data } = useSuspenseQuery(checkoutQuery);
  const router = useRouter();
  const { mutate: getPaymentInstructions } = usePaymentInstructions();
  const [widget, setWidget] = useState<string | null>(null);

  const { shippingAddress, separateBillingAddress: billingAddress } = data.checkout;
  const country = shippingAddress.country?.code;
  const state = shippingAddress.state?.code;

  useEffect(() => {
    if (!country) {
      return;
    }

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
  }, [country, id, getPaymentInstructions, state]);

  useEffect(() => {
    const handlePaymentCallback = ({ detail }: PaymentEvent) => {
      if (detail.paymentMethod !== uri && detail.paymentMethod !== id) {
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
  }, [billingAddress, id, router, shippingAddress, getPaymentInstructions, uri]);

  if (widget) {
    return <Widget html={widget} />;
  }
};
