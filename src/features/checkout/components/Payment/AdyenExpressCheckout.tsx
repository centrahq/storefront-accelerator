'use client';

import {
  AddressData,
  AdyenCheckout,
  ApplePay,
  CheckoutAdvancedFlowResponse,
  GooglePay,
  SubmitActions,
  SubmitData,
  UIElement,
} from '@adyen/adyen-web';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';

import { addToCart } from '@/features/cart/service';
import { CheckoutQuery, PaymentMethodKind, SelectionTotalRowType } from '@gql/graphql';

import { checkoutPaymentMethodsQuery, expressCheckoutWidgetsQuery, PaymentConfigResponse } from '../../queries';
import { fetchCheckout, setShippingMethod, submitPaymentInstructions } from '../../service';
import { AdyenAddress } from './types';

const mapApplePayAddressToCentra = (
  appleAddress: ApplePayJS.ApplePayPaymentContact,
  email: string,
  phoneNumber: string,
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

export const AdyenExpressCheckout = ({
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
  const adyenPaymentMethod = checkoutPaymentMethodsData?.paymentMethods.find(
    (method) => method.kind === PaymentMethodKind.AdyenDropin,
  );
  const shippingMethods = useMemo(
    () => checkoutPaymentMethodsData?.shippingMethods ?? [],
    [checkoutPaymentMethodsData],
  );
  console.log(checkoutPaymentMethodsData);
  const grandTotal = cartTotal;
  const cartTotalInMinor = Math.round(grandTotal * 100);
  useEffect(() => {
    itemRef.current = itemId;
  }, [itemId]);
  // Fetch payment configuration
  const { data: paymentConfig } = useQuery(
    expressCheckoutWidgetsQuery({
      pluginUri: adyenPaymentMethod?.uri,
      returnUrl: `${window.location.origin}/success`,
      amount: cartTotalInMinor,
      lineItems: initialLineItems,
      language,
      market,
    }),
  );
  console.log(paymentConfig);

  useEffect(() => {
    const returnUrl = `${window.location.origin}/success`;

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
      const setDefaultShippingMethod = async () => {
        if (shippingMethods.length === 0) {
          throw new Error('No shipping methods available');
        }

        const defaultMethod = shippingMethods[0];
        if (defaultMethod) {
          await setShippingMethod(defaultMethod.id);
        }
      };

      const addressUpdateHandler = async (shippingAddress: google.payments.api.IntermediateAddress) => {
        try {
          await setDefaultShippingMethod();

          const address = {
            city: shippingAddress.locality,
            country: shippingAddress.countryCode,
            zipCode: shippingAddress.postalCode,
            state: shippingAddress.administrativeArea,
          };

          const data = await submitPaymentInstructions({
            shippingAddress: {
              address1: '',
              ...address,
            },
            paymentReturnPage: `${window.location.origin}/success`,
            paymentFailedPage: `${window.location.origin}/failed`,
            paymentInitiateOnly: true,
            express: true,
          });

          const grandTotal = data.selection.checkout.totals.find((t) => t.type === SelectionTotalRowType.GrandTotal);

          if (!grandTotal) {
            throw new Error('Grand total not found');
          }

          return {
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
        } catch (error) {
          console.error('Address update error:', error);
          throw error;
        }
      };

      const handleGooglePayShippingMethodUpdate = async (shippingMethodId: string) => {
        const data = await setShippingMethod(Number(shippingMethodId));

        const grandTotal = data.checkout.totals.find((t) => t.type === SelectionTotalRowType.GrandTotal);

        if (!grandTotal) {
          throw new Error('Grand total not found');
        }

        return {
          currency: grandTotal.price.currency.code,
          displayItems: createGooglePayLineItems(data.checkout.totals, data.lines),
          grandTotalPriceAsNumber: grandTotal.price.value.toFixed(2),
        };
      };

      const googlePayPaymentDataChangedHandler: google.payments.api.PaymentDataChangedHandler = async ({
        callbackTrigger,
        shippingAddress,
        shippingOptionData,
      }) => {
        if (callbackTrigger === 'INITIALIZE') {
          if (itemRef.current) {
            try {
              const checkout = await fetchCheckout();
              const hasProductInSelection = checkout.lines.some((line) => line?.item.id === itemRef.current);

              if (!hasProductInSelection) {
                await addToCart({ item: itemRef.current });
              }
            } catch (error) {
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

          return {
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
        }

        if (callbackTrigger === 'SHIPPING_OPTION') {
          if (!shippingOptionData) {
            throw new Error('Missing shipping option');
          }

          const detail = await handleGooglePayShippingMethodUpdate(shippingOptionData.id);

          return {
            newTransactionInfo: {
              currencyCode: detail.currency,
              displayItems: detail.displayItems,
              totalPrice: detail.grandTotalPriceAsNumber,
              totalPriceLabel: 'Total',
              totalPriceStatus: 'FINAL',
            },
          };
        }

        return {};
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
        const { authorizedEvent } = payload;
        const { email } = authorizedEvent;
        const billingAddress = authorizedEvent.paymentMethodData.info?.billingAddress;
        const { shippingAddress } = authorizedEvent;

        if (!email) {
          actions.reject({
            intent: 'PAYMENT_AUTHORIZATION',
            message: 'Email is required',
            reason: 'PAYMENT_DATA_INVALID',
          });
          return;
        }

        if (!billingAddress) {
          actions.reject({
            intent: 'PAYMENT_AUTHORIZATION',
            message: 'Billing address is required',
            reason: 'PAYMENT_DATA_INVALID',
          });
          return;
        }

        if (!shippingAddress) {
          actions.reject({
            intent: 'PAYMENT_AUTHORIZATION',
            message: 'Shipping address is required',
            reason: 'PAYMENT_DATA_INVALID',
          });
          return;
        }

        billingAddressRef.current = mapAdyenAddressToCentra(billingAddress, email);
        shippingAddressRef.current = mapAdyenAddressToCentra(shippingAddress, email);
        actions.resolve();
      };

      const handleOnSubmit = async (state: SubmitData, actions: SubmitActions) => {
        const adyenShippingAddress = shippingAddressRef.current;
        const adyenBillingAddress = billingAddressRef.current;

        if (!adyenShippingAddress || !adyenBillingAddress) {
          actions.reject({
            error: {
              googlePayError: {
                intent: 'PAYMENT_AUTHORIZATION',
                message: 'Address should be defined',
                reason: 'PAYMENT_DATA_INVALID',
              },
            },
          });
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
            paymentReturnPage: `${window.location.origin}/success`,
            paymentFailedPage: `${window.location.origin}/failed`,
            paymentMethodSpecificFields: state.data as unknown as Record<string, unknown>,
            express: true,
          });
          const formFields: Record<string, string> | null =
            response.action?.__typename === 'JavascriptPaymentAction'
              ? ((response.action.formFields as Record<string, string> | undefined) ?? {})
              : null;
          if (formFields) {
            actions.resolve({
              ...(formFields as unknown as CheckoutAdvancedFlowResponse),
            });
          } else {
            actions.resolve({
              resultCode: 'Authorised',
            });
          }
        } catch (error) {
          console.error('Payment error:', error);
          actions.reject({
            error: {
              googlePayError: {
                intent: 'PAYMENT_AUTHORIZATION',
                message: 'Could not process payment',
                reason: 'PAYMENT_DATA_INVALID',
              },
            },
          });
        }
      };

      const onApplePayClick = async (resolve: VoidFunction, reject: (error: Error) => void) => {
        if (itemRef.current) {
          try {
            const checkout = await fetchCheckout();
            const hasProductInSelection = checkout.lines.some((line) => line?.item.id === itemRef.current);

            if (!hasProductInSelection) {
              await addToCart({ item: itemRef.current });
            }
          } catch (error) {
            console.error('Failed to add item to cart:', error);
            reject(new Error('Failed to add item to cart'));
            return;
          }
        }

        resolve();
      };

      const onApplePayShippingMethodSelected = async (
        resolve: (data: ApplePayJS.ApplePayShippingMethodUpdate) => void,
        reject: (error?: Error) => void,
        event: ApplePayJS.ApplePayShippingMethodSelectedEvent,
      ) => {
        try {
          const data = await setShippingMethod(Number(event.shippingMethod.identifier));
          const grandTotal =
            data.checkout.totals.find((t) => t.type === SelectionTotalRowType.GrandTotal)?.price.value ?? 0;

          resolve({
            newLineItems: createApplePayLineItems(data.checkout.totals, data.lines),
            newTotal: {
              amount: grandTotal.toFixed(2),
              label: 'Total',
            },
          });
        } catch (error) {
          console.error('Shipping method error:', error);
          reject();
        }
      };

      const onShippingContactSelected = (
        resolve: (data: ApplePayJS.ApplePayShippingContactUpdate) => void,
        reject: (error?: Error) => void,
        event: ApplePayJS.ApplePayShippingContactSelectedEvent,
        paymentConfig: PaymentConfigResponse,
      ) => {
        const shippingAddress = event.shippingContact;

        if (shippingAddress.countryCode !== paymentConfig.country) {
          resolve({
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
          });
          return;
        }

        const address = {
          city: shippingAddress.locality ?? '',
          country: shippingAddress.countryCode ?? '',
          state: shippingAddress.administrativeArea ?? '',
          zipCode: shippingAddress.postalCode ?? '',
        };
        submitPaymentInstructions({
          shippingAddress: {
            address1: '',
            ...address,
          },
          paymentReturnPage: `${window.location.origin}/success`,
          paymentFailedPage: `${window.location.origin}/failed`,
          paymentInitiateOnly: true,
          express: true,
        })
          .then((data) => {
            const grandTotal =
              data.selection.checkout.totals.find((t) => t.type === SelectionTotalRowType.GrandTotal)?.price.value ?? 0;

            const shippingMethods = (data.selection.checkout.shippingMethods ?? []).map((method) => ({
              amount: method.price.value.toString(),
              detail: '',
              identifier: String(method.id),
              label: method.name,
            }));

            resolve({
              newLineItems: createApplePayLineItems(data.selection.checkout.totals, data.selection.lines),
              newShippingMethods: shippingMethods,
              newTotal: {
                amount: grandTotal.toFixed(2),
                label: 'Total',
              },
            });
          })
          .catch((error: unknown) => {
            console.error('Shipping contact error:', error);
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
        onAdditionalDetails: (state) => {
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
          form.method = 'post'; // required to be supported since adyen might send POST from 3DS
          form.action = returnUrl;

          const flattenedItems = flattenForPost(state.data as Record<string, unknown>, '');

          Object.entries(flattenedItems).forEach(([name, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
          });

          form.style.cssText = 'position:absolute;left:-100px;top:-100px;';
          document.body.appendChild(form);
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
          window.location.href = returnUrl;
        },
        onSubmit: (state: SubmitData, _component: UIElement, actions: SubmitActions) => {
          void handleOnSubmit(state, actions);
        },
        onPaymentFailed: () => {
          console.log('Payment failed');
        },
        onError: () => {
          console.log('Error');
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
          const paymentData = payload.authorizedEvent.payment;
          const { shippingContact } = paymentData;
          const email = shippingContact?.emailAddress;
          const phoneNumber = shippingContact?.phoneNumber;

          if (!email || !phoneNumber || !paymentData.billingContact) {
            actions.reject();
            return;
          }

          billingAddressRef.current = mapApplePayAddressToCentra(paymentData.billingContact, email, phoneNumber);
          shippingAddressRef.current = mapApplePayAddressToCentra(shippingContact, email, phoneNumber);
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
          void handleOnSubmit(state, actions);
        },
        requiredBillingContactFields: ['postalAddress', 'name', 'email'],
        requiredShippingContactFields: ['postalAddress', 'name', 'email'],
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
          if (applePayContainerRef.current) {
            applePay.mount(applePayContainerRef.current);
          }
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            console.error('Apple Pay not available:', error.name, error.message);
          } else {
            console.error('Apple Pay not available:', error);
          }
        });
    };

    void init();
  }, [initialLineItems, paymentConfig, shippingMethods, disabled]);

  return (
    <>
      <div ref={googlePayContainerRef} style={{ display: disabled ? 'none' : 'block' }} />
      <div ref={applePayContainerRef} style={{ display: disabled ? 'none' : 'block' }} />
    </>
  );
};
