'use client';

import {
  AddressData,
  AdyenCheckout,
  AdyenCheckoutError,
  ApplePay,
  CheckoutAdvancedFlowResponse,
  GooglePay,
  SubmitActions,
  SubmitData,
  UIElement,
} from '@adyen/adyen-web';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef } from 'react';

import { addToCart, updateLine } from '@/features/cart/service';
import { CheckoutQuery, PaymentMethodKind, SelectionTotalRowType } from '@gql/graphql';

import { checkoutPaymentMethodsQuery, expressCheckoutWidgetsQuery, PaymentConfigResponse } from '../../queries';
import { fetchCheckout, setShippingMethod, submitPaymentInstructions } from '../../service';
import { AdyenExpressCheckoutErrorBoundary } from './AdyenExpressCheckoutErrorBoundary';
import { AdyenAddress } from './types';

const ADYEN_EXPRESS_DEBUG_STORAGE_KEY = 'adyenExpressCheckout:debugLogs';

const safeJsonStringify = (value: unknown) => {
  try {
    return JSON.stringify(
      value,
      (_key: string, v: unknown) => {
        if (typeof v === 'function') {
          return `[Function ${v.name || 'anonymous'}]`;
        }
        if (v instanceof Error) {
          return { name: v.name, message: v.message, stack: v.stack };
        }
        return v;
      },
      2,
    );
  } catch (e) {
    try {
      return JSON.stringify({ unserializable: true, error: String(e) });
    } catch {
      return '{"unserializable":true}';
    }
  }
};

const debugLog = (event: string, payload: unknown) => {
  if (process.env.NEXT_PUBLIC_ADYEN_EXPRESS_CHECKOUT_DEBUG !== 'true') {
    return;
  }

  const entry = {
    ts: new Date().toISOString(),
    event,
    payload,
  };

  // Keep logs readable in the console and also persisted across navigations.
  const serialized = safeJsonStringify(entry);
  console.log(`[AdyenExpressCheckout] ${event}`, serialized);

  if (typeof window === 'undefined') {
    return;
  }

  try {
    const existing = window.sessionStorage.getItem(ADYEN_EXPRESS_DEBUG_STORAGE_KEY);
    const parsed: unknown = existing ? JSON.parse(existing) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    list.push(entry);

    // Prevent sessionStorage blowups: keep only the most recent N entries.
    const MAX = 200;
    const trimmed = list.length > MAX ? list.slice(list.length - MAX) : list;
    window.sessionStorage.setItem(ADYEN_EXPRESS_DEBUG_STORAGE_KEY, safeJsonStringify(trimmed));
  } catch (e) {
    console.warn('[AdyenExpressCheckout] Failed to persist debug log', e);
  }
};

const mapApplePayAddressToCentra = (
  appleAddress: ApplePayJS.ApplePayPaymentContact,
  email: string | undefined,
  phoneNumber: string | undefined,
): AdyenAddress => {
  return {
    address1: appleAddress.addressLines?.[0] ?? '',
    city: appleAddress.locality ?? '',
    country: appleAddress.countryCode ?? '',
    email,
    firstName: appleAddress.givenName ?? '',
    lastName: appleAddress.familyName ?? '',
    phoneNumber,
    state: appleAddress.administrativeArea ?? '',
    zipCode: appleAddress.postalCode ?? '',
  };
};

const mapAdyenAddressToCentra = (adyenAddress: Partial<google.payments.api.Address>, email: string): AdyenAddress => {
  return {
    address1: adyenAddress.address1 ?? '',
    city: adyenAddress.locality ?? '',
    country: adyenAddress.countryCode ?? '',
    email,
    firstName: adyenAddress.name?.split(' ')[0] ?? '',
    lastName: adyenAddress.name?.split(' ')[1] ?? '',
    phoneNumber: adyenAddress.phoneNumber ?? '',
    state: adyenAddress.administrativeArea ?? '',
    zipCode: adyenAddress.postalCode ?? '',
  };
};

const createGooglePayLineItems = (
  totals: NonNullable<CheckoutQuery['selection']['checkout']>['totals'],
  lines: CheckoutQuery['selection']['lines'],
): google.payments.api.DisplayItem[] => {
  const itemsTotal = totals.find((t) => t.type === SelectionTotalRowType.ItemsSubtotal)?.price.value ?? 0;
  const tax = totals.find((t) => t.type === SelectionTotalRowType.IncludingTaxTotal)?.price.value ?? 0;
  const shipping = totals.find((t) => t.type === SelectionTotalRowType.Shipping)?.price.value ?? 0;

  return [
    ...lines.map((line) => ({
      label: line?.displayItem.name ?? 'Product',
      price: line?.lineValue.value.toFixed(2) ?? '0.00',
      type: 'LINE_ITEM' as const,
    })),
    {
      label: 'Subtotal',
      price: itemsTotal.toFixed(2),
      type: 'SUBTOTAL' as const,
    },
    {
      label: 'Tax',
      price: tax.toFixed(2),
      type: 'TAX' as const,
    },
    {
      label: 'Shipping',
      price: shipping.toFixed(2),
      type: 'SHIPPING_OPTION' as const,
    },
  ];
};

const createApplePayLineItems = (
  totals: NonNullable<CheckoutQuery['selection']['checkout']>['totals'],
  lines: CheckoutQuery['selection']['lines'],
): ApplePayJS.ApplePayLineItem[] => {
  const itemsTotal = totals.find((t) => t.type === SelectionTotalRowType.ItemsSubtotal)?.price.value ?? 0;
  const tax = totals.find((t) => t.type === SelectionTotalRowType.IncludingTaxTotal)?.price.value ?? 0;
  const shipping = totals.find((t) => t.type === SelectionTotalRowType.Shipping)?.price.value ?? 0;

  return [
    ...lines.map((line) => ({
      amount: line?.lineValue.value.toFixed(2) ?? '0.00',
      label: line?.displayItem.name ?? 'Product',
      type: 'final' as const,
    })),
    {
      amount: itemsTotal.toFixed(2),
      label: 'Subtotal',
      type: 'final' as const,
    },
    {
      amount: tax.toFixed(2),
      label: 'Tax',
      type: 'final' as const,
    },
    {
      amount: shipping.toFixed(2),
      label: 'Shipping',
      type: 'final' as const,
    },
  ];
};

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
  const shippingAddressRef = useRef<AdyenAddress | undefined>(undefined);
  const billingAddressRef = useRef<AdyenAddress | undefined>(undefined);
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
      returnUrl: `${window.location.origin}/confirmation`,
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
      const setDefaultShippingMethod = async () => {
        if (shippingMethods.length === 0) {
          throw new Error('No shipping methods available');
        }

        const defaultMethod = shippingMethods[0];
        if (defaultMethod) {
          debugLog('setDefaultShippingMethod:choose', defaultMethod);
          await setShippingMethod(defaultMethod.id);
        }
      };

      const addressUpdateHandler = async (shippingAddress: google.payments.api.IntermediateAddress) => {
        try {
          debugLog('addressUpdateHandler:input', { shippingAddress });
          await setDefaultShippingMethod();

          const address = {
            city: shippingAddress.locality,
            country: shippingAddress.countryCode,
            zipCode: shippingAddress.postalCode,
            state: shippingAddress.administrativeArea,
          };
          debugLog('addressUpdateHandler:centraAddress', address);

          const data = await submitPaymentInstructions({
            shippingAddress: {
              address1: '',
              ...address,
            },
            paymentReturnPage: `${window.location.origin}/confirmation`,
            paymentFailedPage: `${window.location.origin}/failed`,
            paymentInitiateOnly: true,
            paymentMethodSpecificFields: { express: true },
          });
          debugLog('addressUpdateHandler:submitPaymentInstructions:response', data);

          const grandTotal = data.selection.checkout.totals.find((t) => t.type === SelectionTotalRowType.GrandTotal);

          if (!grandTotal) {
            throw new Error('Grand total not found');
          }

          const ret = {
            currency: grandTotal.price.currency.code,
            displayItems: createGooglePayLineItems(data.selection.checkout.totals, data.selection.lines),
            grandTotalPriceAsNumber: grandTotal.price.value.toFixed(2),
            shippingMethodsAvailable: (data.selection.checkout.shippingMethods ?? []).map((method) => ({
              id: String(method.id),
              name: method.name,
              price: method.price.formattedValue,
              priceAsNumber: method.price.value,
            })),
          };
          debugLog('addressUpdateHandler:return', ret);
          return ret;
        } catch (error) {
          debugLog('addressUpdateHandler:error', error);
          console.error('Address update error:', error);
          throw error;
        }
      };

      const handleGooglePayShippingMethodUpdate = async (shippingMethodId: string) => {
        debugLog('handleGooglePayShippingMethodUpdate:input', { shippingMethodId });
        const data = await setShippingMethod(Number(shippingMethodId));
        debugLog('handleGooglePayShippingMethodUpdate:setShippingMethod:response', data);

        const grandTotal = data.checkout.totals.find((t) => t.type === SelectionTotalRowType.GrandTotal);

        if (!grandTotal) {
          throw new Error('Grand total not found');
        }

        const ret = {
          currency: grandTotal.price.currency.code,
          displayItems: createGooglePayLineItems(data.checkout.totals, data.lines),
          grandTotalPriceAsNumber: grandTotal.price.value.toFixed(2),
        };
        debugLog('handleGooglePayShippingMethodUpdate:return', ret);
        return ret;
      };

      const googlePayPaymentDataChangedHandler: google.payments.api.PaymentDataChangedHandler = async ({
        callbackTrigger,
        shippingAddress,
        shippingOptionData,
      }) => {
        debugLog('googlePayPaymentDataChangedHandler:input', { callbackTrigger, shippingAddress, shippingOptionData });
        if (callbackTrigger === 'INITIALIZE') {
          if (itemRef.current) {
            try {
              const checkout = await fetchCheckout();
              debugLog('googlePayPaymentDataChangedHandler:INITIALIZE:fetchCheckout', checkout);
              const hasProductInSelection = checkout.lines.some((line) => line?.item.id === itemRef.current);

              if (!hasProductInSelection) {
                const addedSelection = await addToCart({ item: itemRef.current });
                debugLog('googlePayPaymentDataChangedHandler:INITIALIZE:addToCart:response', addedSelection);
                // Find the newly added item's line ID
                const addedItem = addedSelection.lines.find((line) => line?.item.id === itemRef.current);
                if (addedItem) {
                  addedItemLineRef.current = addedItem.id;
                  debugLog('googlePayPaymentDataChangedHandler:INITIALIZE:addedItemLine', {
                    itemId: itemRef.current,
                    lineId: addedItem.id,
                  });
                }
              }
            } catch (error) {
              debugLog('googlePayPaymentDataChangedHandler:INITIALIZE:error', error);
              console.error('Failed to add item to cart:', error);
              throw new Error('Failed to add item to cart');
            }
          }
        }

        if (callbackTrigger === 'INITIALIZE' || callbackTrigger === 'SHIPPING_ADDRESS') {
          if (!shippingAddress) {
            throw new Error('Missing shipping address');
          }

          const detail = await addressUpdateHandler(shippingAddress);

          const ret = {
            newShippingOptionParameters: {
              shippingOptions: detail.shippingMethodsAvailable.map((method) => ({
                description: '',
                id: method.id,
                label: `${method.name} - ${method.price}`,
              })),
            },
            newTransactionInfo: {
              currencyCode: detail.currency,
              displayItems: detail.displayItems,
              totalPrice: detail.grandTotalPriceAsNumber,
              totalPriceLabel: 'Total',
              totalPriceStatus: 'FINAL',
            },
          };
          debugLog('googlePayPaymentDataChangedHandler:return', ret);
          return ret;
        }

        if (callbackTrigger === 'SHIPPING_OPTION') {
          if (!shippingOptionData) {
            throw new Error('Missing shipping option');
          }

          const detail = await handleGooglePayShippingMethodUpdate(shippingOptionData.id);

          const ret = {
            newTransactionInfo: {
              currencyCode: detail.currency,
              displayItems: detail.displayItems,
              totalPrice: detail.grandTotalPriceAsNumber,
              totalPriceLabel: 'Total',
              totalPriceStatus: 'FINAL',
            },
          };
          debugLog('googlePayPaymentDataChangedHandler:return', ret);
          return ret;
        }

        const ret = {};
        debugLog('googlePayPaymentDataChangedHandler:return', ret);
        return ret;
      };

      const onAuthorizedHandler = (
        payload: {
          authorizedEvent: google.payments.api.PaymentData;
          billingAddress?: Partial<AddressData>;
          deliveryAddress?: Partial<AddressData>;
        },
        actions: {
          resolve: () => void;
          reject: (error?: google.payments.api.PaymentDataError | string) => void;
        },
      ) => {
        debugLog('googlePay:onAuthorized:input', payload);
        const { authorizedEvent } = payload;
        const { email } = authorizedEvent;
        const billingAddress = authorizedEvent.paymentMethodData.info?.billingAddress;
        const { shippingAddress } = authorizedEvent;

        if (!email) {
          const err = {
            intent: 'PAYMENT_AUTHORIZATION',
            message: 'Email is required',
            reason: 'PAYMENT_DATA_INVALID',
          } as const;
          debugLog('googlePay:onAuthorized:reject', err);
          actions.reject(err);
          return;
        }

        if (!billingAddress) {
          const err = {
            intent: 'PAYMENT_AUTHORIZATION',
            message: 'Billing address is required',
            reason: 'PAYMENT_DATA_INVALID',
          } as const;
          debugLog('googlePay:onAuthorized:reject', err);
          actions.reject(err);
          return;
        }

        if (!shippingAddress) {
          const err = {
            intent: 'PAYMENT_AUTHORIZATION',
            message: 'Shipping address is required',
            reason: 'PAYMENT_DATA_INVALID',
          } as const;
          debugLog('googlePay:onAuthorized:reject', err);
          actions.reject(err);
          return;
        }

        billingAddressRef.current = mapAdyenAddressToCentra(billingAddress, email);
        shippingAddressRef.current = mapAdyenAddressToCentra(shippingAddress, email);
        debugLog('googlePay:onAuthorized:resolvedAddresses', {
          billingAddress: billingAddressRef.current,
          shippingAddress: shippingAddressRef.current,
        });
        actions.resolve();
      };

      const handleOnSubmit = async (state: SubmitData, actions: SubmitActions) => {
        debugLog('handleOnSubmit:input', {
          hasShippingAddress: Boolean(shippingAddressRef.current),
          hasBillingAddress: Boolean(billingAddressRef.current),
          stateData: state.data,
        });
        const adyenShippingAddress = shippingAddressRef.current;
        const adyenBillingAddress = billingAddressRef.current;

        if (!adyenShippingAddress || !adyenBillingAddress) {
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
              address1: adyenShippingAddress.address1,
              city: adyenShippingAddress.city,
              country: adyenShippingAddress.country,
              zipCode: adyenShippingAddress.zipCode,
              state: adyenShippingAddress.state,
              email: adyenShippingAddress.email,
              firstName: adyenShippingAddress.firstName,
              lastName: adyenShippingAddress.lastName,
              phoneNumber: adyenShippingAddress.phoneNumber,
            },
            separateBillingAddress: {
              address1: adyenBillingAddress.address1,
              city: adyenBillingAddress.city,
              country: adyenBillingAddress.country,
              zipCode: adyenBillingAddress.zipCode,
              state: adyenBillingAddress.state,
              email: adyenBillingAddress.email,
              firstName: adyenBillingAddress.firstName,
              lastName: adyenBillingAddress.lastName,
              phoneNumber: adyenBillingAddress.phoneNumber,
            },
            paymentReturnPage: `${window.location.origin}/confirmation`,
            paymentFailedPage: `${window.location.origin}/failed`,
            paymentMethodSpecificFields: { ...(state.data as unknown as Record<string, unknown>), express: true },
          });
          debugLog('handleOnSubmit:submitPaymentInstructions:response', response);
          const formFields: Record<string, string> | null =
            response.action?.__typename === 'JavascriptPaymentAction'
              ? ((response.action.formFields as Record<string, string> | undefined) ?? {})
              : null;
          if (formFields) {
            const resolved = {
              ...(formFields as unknown as CheckoutAdvancedFlowResponse),
            };
            debugLog('handleOnSubmit:resolve', resolved);
            actions.resolve(resolved);
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

      const onApplePayClick = async (resolve: VoidFunction, reject: (error: Error) => void) => {
        debugLog('applePay:onClick:input', { itemId: itemRef.current });
        if (itemRef.current) {
          try {
            const checkout = await fetchCheckout();
            debugLog('applePay:onClick:fetchCheckout', checkout);
            const hasProductInSelection = checkout.lines.some((line) => line?.item.id === itemRef.current);

            if (!hasProductInSelection) {
              const addedSelection = await addToCart({ item: itemRef.current });
              debugLog('applePay:onClick:addToCart:response', addedSelection);
              // Find the newly added item's line ID
              const addedItem = addedSelection.lines.find((line) => line?.item.id === itemRef.current);
              if (addedItem) {
                addedItemLineRef.current = addedItem.id;
                debugLog('applePay:onClick:addedItemLine', { itemId: itemRef.current, lineId: addedItem.id });
              }
            }
          } catch (error) {
            debugLog('applePay:onClick:error', error);
            console.error('Failed to add item to cart:', error);
            const err = new Error('Failed to add item to cart');
            debugLog('applePay:onClick:reject', { name: err.name, message: err.message });
            reject(err);
            return;
          }
        }

        debugLog('applePay:onClick:resolve', {});
        resolve();
      };

      const onApplePayShippingMethodSelected = async (
        resolve: (data: ApplePayJS.ApplePayShippingMethodUpdate) => void,
        reject: (error?: Error) => void,
        event: ApplePayJS.ApplePayShippingMethodSelectedEvent,
      ) => {
        try {
          debugLog('applePay:onShippingMethodSelected:input', event);
          const data = await setShippingMethod(Number(event.shippingMethod.identifier));
          debugLog('applePay:onShippingMethodSelected:setShippingMethod:response', data);
          const grandTotal =
            data.checkout.totals.find((t) => t.type === SelectionTotalRowType.GrandTotal)?.price.value ?? 0;

          const ret: ApplePayJS.ApplePayShippingMethodUpdate = {
            newLineItems: createApplePayLineItems(data.checkout.totals, data.lines),
            newTotal: {
              amount: grandTotal.toFixed(2),
              label: 'Total',
            },
          };
          debugLog('applePay:onShippingMethodSelected:resolve', ret);
          resolve(ret);
        } catch (error) {
          debugLog('applePay:onShippingMethodSelected:error', error);
          console.error('Shipping method error:', error);
          debugLog('applePay:onShippingMethodSelected:reject', {});
          reject();
        }
      };

      const onShippingContactSelected = (
        resolve: (data: ApplePayJS.ApplePayShippingContactUpdate) => void,
        reject: (error?: Error) => void,
        event: ApplePayJS.ApplePayShippingContactSelectedEvent,
        paymentConfig: PaymentConfigResponse,
      ) => {
        debugLog('applePay:onShippingContactSelected:input', { event, paymentConfig });
        const shippingAddress = event.shippingContact;

        if (shippingAddress.countryCode !== paymentConfig.country) {
          const ret: ApplePayJS.ApplePayShippingContactUpdate = {
            errors: [
              new (window as unknown as { ApplePayError: typeof ApplePayError }).ApplePayError(
                'shippingContactInvalid',
                'countryCode',
                'Cannot ship to the selected address',
              ),
            ],
            newTotal: {
              amount: paymentConfig.paymentAmount.amount.toString(),
              label: 'Total',
            },
          };
          debugLog('applePay:onShippingContactSelected:resolve', ret);
          resolve(ret);
          return;
        }

        const address = {
          city: shippingAddress.locality ?? '',
          country: shippingAddress.countryCode ?? '',
          state: shippingAddress.administrativeArea ?? '',
          zipCode: shippingAddress.postalCode ?? '',
        };
        debugLog('applePay:onShippingContactSelected:centraAddress', address);
        submitPaymentInstructions({
          shippingAddress: {
            address1: '',
            ...address,
          },
          paymentReturnPage: `${window.location.origin}/confirmation`,
          paymentFailedPage: `${window.location.origin}/failed`,
          paymentInitiateOnly: true,
          paymentMethodSpecificFields: { express: true },
        })
          .then((data) => {
            debugLog('applePay:onShippingContactSelected:submitPaymentInstructions:response', data);
            const grandTotal =
              data.selection.checkout.totals.find((t) => t.type === SelectionTotalRowType.GrandTotal)?.price.value ?? 0;

            const shippingMethods = (data.selection.checkout.shippingMethods ?? []).map((method) => ({
              amount: method.price.value.toString(),
              detail: '',
              identifier: String(method.id),
              label: method.name,
            }));

            const ret: ApplePayJS.ApplePayShippingContactUpdate = {
              newLineItems: createApplePayLineItems(data.selection.checkout.totals, data.selection.lines),
              newShippingMethods: shippingMethods,
              newTotal: {
                amount: grandTotal.toFixed(2),
                label: 'Total',
              },
            };
            debugLog('applePay:onShippingContactSelected:resolve', ret);
            resolve(ret);
          })
          .catch((error: unknown) => {
            debugLog('applePay:onShippingContactSelected:error', error);
            console.error('Shipping contact error:', error);
            debugLog('applePay:onShippingContactSelected:reject', {});
            reject();
          });
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
        onError: (error: AdyenCheckoutError) => {
          debugLog('adyenCheckout:onError', error);
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

      const googlePay = new GooglePay(checkout, {
        billingAddressParameters: {
          format: 'FULL',
          phoneNumberRequired: paymentConfig.billingPhoneNumberRequired,
        },
        billingAddressRequired: true,
        callbackIntents: ['SHIPPING_ADDRESS', 'SHIPPING_OPTION'],
        emailRequired: true,
        isExpress: true,
        onAuthorized: onAuthorizedHandler,
        onPaymentCompleted: () => {
          debugLog('googlePay:onPaymentCompleted', {});
          window.location.href = `${window.location.origin}/confirmation`;
        },
        onSubmit: (state: SubmitData, _component: UIElement, actions: SubmitActions) => {
          debugLog('googlePay:onSubmit:called', { stateData: state.data });
          void handleOnSubmit(state, actions);
        },
        onPaymentFailed: () => {
          debugLog('googlePay:onPaymentFailed', {});
          console.log('Payment failed');
        },
        paymentDataCallbacks: {
          onPaymentDataChanged: googlePayPaymentDataChangedHandler,
        },
        shippingAddressParameters: {
          allowedCountryCodes: [paymentConfig.country],
          phoneNumberRequired: paymentConfig.shippingPhoneNumberRequired,
        },
        shippingAddressRequired: true,
        shippingOptionParameters: {
          shippingOptions: paymentConfig.shippingMethods.map((method) => ({
            description: '',
            id: method.id,
            label: `${method.name} - ${method.price}`,
          })),
        },
        shippingOptionRequired: true,
        transactionInfo: {
          currencyCode: paymentConfig.paymentAmount.currency,
          displayItems: initialLineItems.map((item) => ({
            label: item.name,
            price: item.price,
            type: 'LINE_ITEM' as const,
          })),
          totalPrice: paymentConfig.paymentAmount.amount.toFixed(2),
          totalPriceLabel: 'Total',
          totalPriceStatus: 'FINAL',
        },
      });

      if (googlePayContainerRef.current) {
        debugLog('googlePay:mount', { container: 'googlePayContainerRef' });
        googlePay.mount(googlePayContainerRef.current);
      }

      const applePay = new ApplePay(checkout, {
        isExpress: true,
        lineItems: initialLineItems.map((item) => ({
          amount: item.price,
          label: item.name,
          type: 'final' as const,
        })),
        onAuthorized: (payload, actions) => {
          debugLog('applePay:onAuthorized:input', payload);
          const paymentData = payload.authorizedEvent.payment;
          const { shippingContact, billingContact } = paymentData;
          if (!shippingContact || !billingContact) {
            debugLog('applePay:onAuthorized:reject', {
              missing: { shippingContact, billingContact },
            });
            actions.reject();
            return;
          }
          const shippingEmail = shippingContact.emailAddress;
          const shippingPhoneNumber = shippingContact.phoneNumber;
          billingAddressRef.current = mapApplePayAddressToCentra(billingContact, shippingEmail, shippingPhoneNumber);
          shippingAddressRef.current = mapApplePayAddressToCentra(shippingContact, shippingEmail, shippingPhoneNumber);
          debugLog('applePay:onAuthorized:resolvedAddresses', {
            billingAddress: billingAddressRef.current,
            shippingAddress: shippingAddressRef.current,
          });
          actions.resolve();
        },
        onClick: (resolve: VoidFunction, reject: (error: Error) => void) => {
          void onApplePayClick(resolve, reject);
        },
        onShippingContactSelected: (
          resolve: (data: ApplePayJS.ApplePayShippingContactUpdate) => void,
          reject: (error?: Error) => void,
          event,
        ) => {
          onShippingContactSelected(resolve, reject, event, paymentConfig);
        },
        onShippingMethodSelected: (
          resolve: (data: ApplePayJS.ApplePayShippingMethodUpdate) => void,
          reject: (error?: Error) => void,
          event,
        ) => {
          void onApplePayShippingMethodSelected(resolve, reject, event);
        },
        onSubmit: (state: SubmitData, _component: UIElement, actions: SubmitActions) => {
          debugLog('applePay:onSubmit:called', { stateData: state.data });
          void handleOnSubmit(state, actions);
        },
        requiredBillingContactFields: ['postalAddress'],
        requiredShippingContactFields:
          paymentConfig.shippingPhoneNumberRequired || paymentConfig.billingPhoneNumberRequired
            ? ['postalAddress', 'name', 'email', 'phone']
            : ['postalAddress', 'name', 'email'],
        shippingMethods: paymentConfig.shippingMethods.map((method) => ({
          amount: method.price.toString(),
          detail: '',
          identifier: method.id,
          label: `${method.name} - ${method.price}`,
        })),
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
