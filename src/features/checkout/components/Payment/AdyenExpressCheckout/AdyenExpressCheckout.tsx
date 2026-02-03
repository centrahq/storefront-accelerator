'use client';

import {
  AdyenCheckout,
  AdyenCheckoutError,
  CheckoutAdvancedFlowResponse,
  SubmitActions,
  SubmitData
} from '@adyen/adyen-web';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';

import { updateLine } from '@/features/cart/service';
import { PaymentMethodKind } from '@gql/graphql';

import { checkoutPaymentMethodsQuery, expressCheckoutWidgetsQuery } from '../../../queries';
import { initializeCheckoutWithExpress, submitPaymentInstructions } from '../../../service';
import { AdyenExpressCheckoutErrorBoundary } from '../AdyenExpressCheckoutErrorBoundary';
import { AdyenAddress } from '../types';
import { getApplePay } from './applePay';
import { debugLog } from './debug';
import { getGooglePay } from './googlePay';



interface Props {
  itemId?: string;
  cartTotal: number;
  initialLineItems: {
    name: string;
    price: string;
  }[];
  disabled?: boolean;
  language: string;
  market: number;
}

export const AdyenExpressCheckoutInner = ({
  itemId,
  cartTotal,
  initialLineItems,
  disabled = false,
  language,
  market,
}: Props) => {
  const { data: checkoutPaymentMethodsData } = useSuspenseQuery(checkoutPaymentMethodsQuery);
  const initializedRef = useRef(false);
  const googlePayContainerRef = useRef<HTMLDivElement>(null);
  const applePayContainerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<string | undefined>(undefined);
  const addedItemLineRef = useRef<string | null>(null);
  const adyenPaymentMethod = checkoutPaymentMethodsData?.paymentMethods.find(
    (method) => method.kind === PaymentMethodKind.AdyenDropin,
  );
  const shippingMethods = useMemo(
    () => checkoutPaymentMethodsData?.shippingMethods ?? [],
    [checkoutPaymentMethodsData],
  );
  const grandTotal = cartTotal;
  const cartTotalInMinor = Math.round(grandTotal * 100);
  useEffect(() => {
    itemRef.current = itemId;
  }, [itemId]);

  const { data: paymentConfig } = useQuery(
    expressCheckoutWidgetsQuery({
      pluginUri: adyenPaymentMethod?.uri,
      returnUrl: `${window.location.origin}/success?express=true`,
      amount: cartTotalInMinor,
      lineItems: initialLineItems,
      language,
      market,
    }),
  );

  useEffect(() => {
    const init = async () => {
      if (
        !paymentConfig ||
        (!googlePayContainerRef.current && !applePayContainerRef.current) ||
        initializedRef.current ||
        disabled
      ) {
        return;
      }
      initializedRef.current = true;
      debugLog('init:start', {
        disabled,
        itemId: itemRef.current,
        cartTotal,
        cartTotalInMinor,
        initialLineItems,
        hasGooglePayContainer: Boolean(googlePayContainerRef.current),
        hasApplePayContainer: Boolean(applePayContainerRef.current),
        paymentConfig,
      });



      const handleOnSubmit = async (
        state: SubmitData,
        actions: SubmitActions,
        billingAddress?: AdyenAddress,
        shippingAddress?: AdyenAddress,
      ) => {

        debugLog('handleOnSubmit:input', {
          hasShippingAddress: Boolean(shippingAddress),
          hasBillingAddress: Boolean(billingAddress),
          stateData: state.data,
        });

        if (!shippingAddress || !billingAddress) {
          const err = {
            error: {
              googlePayError: {
                intent: 'PAYMENT_AUTHORIZATION',
                message: 'Address should be defined',
                reason: 'PAYMENT_DATA_INVALID',
              },
            },
          } as const;
          debugLog('handleOnSubmit:reject', err);
          actions.reject(err);
          return;
        }

        try {
          const response = await submitPaymentInstructions({
            shippingAddress: {
              address1: shippingAddress.address1,
              city: shippingAddress.city,
              country: shippingAddress.country,
              zipCode: shippingAddress.zipCode,
              state: shippingAddress.state,
              email: shippingAddress.email,
              firstName: shippingAddress.firstName,
              lastName: shippingAddress.lastName,
              phoneNumber: shippingAddress.phoneNumber,
            },
            separateBillingAddress: {
              address1: billingAddress.address1,
              city: billingAddress.city,
              country: billingAddress.country,
              zipCode: billingAddress.zipCode,
              state: billingAddress.state,
              email: billingAddress.email,
              firstName: billingAddress.firstName,
              lastName: billingAddress.lastName,
              phoneNumber: billingAddress.phoneNumber,
            },
            paymentReturnPage: `${window.location.origin}/success?express=true`,
            paymentFailedPage: `${window.location.origin}/failed`,
            paymentMethodSpecificFields: { ...(state.data as unknown as Record<string, unknown>), express: true },
          });
          debugLog('handleOnSubmit:submitPaymentInstructions:response', response);
          const formFields: Record<string, string> | null =
            response.action?.__typename === 'JavascriptPaymentAction'
              ? ((response.action.formFields as Record<string, string> | undefined) ?? null)
              : null;
          if (formFields) {
            const resolved = {
              ...(formFields as unknown as CheckoutAdvancedFlowResponse),
            };
            debugLog('handleOnSubmit:resolve', resolved);
            actions.resolve(resolved);
          } else if (response.action?.__typename === 'RedirectPaymentAction') {
            debugLog('handleOnSubmit:redirect', { url: response.action.url });
            window.location.href = response.action.url;
          } else if (response.action?.__typename === 'FormPaymentAction') {
            debugLog('handleOnSubmit:form-action', { formType: response.action.formType });
            const formContainer = document.createElement('div');
            formContainer.innerHTML = response.action.html;
            document.body.appendChild(formContainer);
          } else {
            const resolved = {
              resultCode: 'Authorised',
            } as const;
            debugLog('handleOnSubmit:resolve', resolved);
            actions.resolve(resolved);
          }
        } catch (error) {
          debugLog('handleOnSubmit:error', error);
          console.error('Payment error:', error);
          const err = {
            error: {
              googlePayError: {
                intent: 'PAYMENT_AUTHORIZATION',
                message: 'Could not process payment',
                reason: 'PAYMENT_DATA_INVALID',
              },
            },
          } as const;
          debugLog('handleOnSubmit:reject', err);
          actions.reject(err);
        }
      };

      const checkout = await AdyenCheckout({
        amount: {
          currency: paymentConfig.paymentAmount.currency,
          value: paymentConfig.paymentAmount.amount,
        },
        clientKey: paymentConfig.clientKey,
        countryCode: paymentConfig.country,
        environment: paymentConfig.context,
        locale: paymentConfig.languageCode,
        paymentMethodsResponse: paymentConfig.paymentMethodsResponse,
        onPaymentCompleted: () => {
          debugLog('adyenCheckout:onPaymentCompleted', {});
          window.location.href = `${window.location.origin}/confirmation`;
        },
        onError: (error: AdyenCheckoutError) => {
          debugLog('adyenCheckout:onError', error);
          void initializeCheckoutWithExpress(false);
          const isCancellationError =
            error.name === 'CANCEL' ||
            (error as unknown as { cause?: { statusCode?: string } }).cause?.statusCode === 'CANCELED';
          if (isCancellationError && addedItemLineRef.current) {
            const lineId = addedItemLineRef.current;
            void updateLine({ id: lineId, quantity: 0 })
              .then(() => {
                console.log('Removed added item from cart due to cancellation');
                addedItemLineRef.current = null;
              })
              .catch((removeError: unknown) => {
                console.error('Failed to remove item from cart:', removeError);
              });
          }
        },
        onAdditionalDetails: (state) => {
          debugLog('adyenCheckout:onAdditionalDetails:input', { stateData: state.data });
          function flattenForPost(data: Record<string, unknown>, prefix: string): Record<string, string> {
            const result: Record<string, string> = {};

            for (const key in data) {
              if (!Object.prototype.hasOwnProperty.call(data, key)) {
                continue;
              }

              const value = data[key];
              const flatKey = prefix.length ? `${prefix}[${key}]` : key;

              if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                Object.assign(result, flattenForPost(value as Record<string, unknown>, flatKey));
              } else {
                result[flatKey] = value as string;
              }
            }

            return result;
          }

          const form = document.createElement('form');
          form.method = 'post';
          form.action = `${window.location.origin}/success`;

          const flattenedItems = flattenForPost(state.data as Record<string, unknown>, '');
          flattenedItems.express = 'true';
          debugLog('adyenCheckout:onAdditionalDetails:flattenedForPost', flattenedItems);

          Object.entries(flattenedItems).forEach(([name, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
          });

          form.style.cssText = 'position:absolute;left:-100px;top:-100px;';
          document.body.appendChild(form);
          debugLog('adyenCheckout:onAdditionalDetails:submit', { action: form.action, method: form.method });
          form.submit();
        },
      });

      const googlePay = getGooglePay({
        checkout,
        paymentConfig,
        initialLineItems,
        handleOnSubmit,
        getItemId: () => itemRef.current,
        shippingMethods,
        onAddedItemLineChange: (lineId) => {
          addedItemLineRef.current = lineId;
        },
      });

      if (googlePayContainerRef.current) {
        debugLog('googlePay:mount', { container: 'googlePayContainerRef' });
        googlePay.mount(googlePayContainerRef.current);
      }

      const applePay = getApplePay({
        checkout,
        initialLineItems,
        getItemId: () => itemRef.current,
        onAddedItemLineChange: (lineId) => {
          addedItemLineRef.current = lineId;
        },
        onSubmit: handleOnSubmit,
        paymentConfig,
      });

      applePay
        .isAvailable()
        .then(() => {
          debugLog('applePay:isAvailable:resolved', {});
          if (applePayContainerRef.current) {
            debugLog('applePay:mount', { container: 'applePayContainerRef' });
            applePay.mount(applePayContainerRef.current);
          }
        })
        .catch((error: unknown) => {
          debugLog('applePay:isAvailable:error', error);
          if (error instanceof Error) {
            console.error('Apple Pay not available:', error.name, error.message);
          } else {
            console.error('Apple Pay not available:', error);
          }
        });
    };

    void init();
  }, [initialLineItems, paymentConfig, shippingMethods, disabled, cartTotal, cartTotalInMinor]);

  return (
    <>
      <div ref={googlePayContainerRef} style={{ display: disabled ? 'none' : 'block' }} />
      <div ref={applePayContainerRef} style={{ display: disabled ? 'none' : 'block' }} />
    </>
  );
};

const AdyenExpressCheckoutDynamic = dynamic(() => Promise.resolve(AdyenExpressCheckoutInner), {
  ssr: false,
});

export const AdyenExpressCheckout = (props: Props) => {
  if (process.env.NEXT_PUBLIC_ADYEN_EXPRESS_CHECKOUT_ENABLED !== 'true') {
    return null;
  }

  return (
    <AdyenExpressCheckoutErrorBoundary>
      <AdyenExpressCheckoutDynamic {...props} />
    </AdyenExpressCheckoutErrorBoundary>
  );
};
