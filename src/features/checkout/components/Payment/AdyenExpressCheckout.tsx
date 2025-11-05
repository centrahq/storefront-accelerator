'use client';

import {
    AddressData,
    AdyenCheckout,
    ApplePay,
    GooglePay,
    SubmitActions,
    SubmitData,
    UIElement,
} from '@adyen/adyen-web';
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';

import { selectionQuery } from '@/features/cart/queries';
import { createAbsoluteURL } from '@/lib/utils/createAbsoluteURL';
import { isDefined } from '@/lib/utils/isDefined';
import { SelectionTotalRowType } from '@gql/graphql';

import { useAdyenExpressCheckoutConfig } from '../../hooks/useAdyenExpressCheckoutConfig';
import { usePaymentInstructions, useSetShippingMethod } from '../../mutations';
import { checkoutQuery, expressCheckoutWidgetsQuery, sessionQuery } from '../../queries';
import { AdyenAddress } from './types';

interface Props {
  itemId?: string;
  product?: {
    uri: string;
    name: string;
    price: number;
  };
}

export const AdyenExpressCheckout = ({ itemId, product }: Props) => {
  const queryClient = useQueryClient();
  const { data: checkoutData } = useSuspenseQuery(checkoutQuery);
  const { data: selectionData } = useSuspenseQuery(selectionQuery);
  const { data: sessionData } = useSuspenseQuery(sessionQuery);
  const { adyenConfig } = useAdyenExpressCheckoutConfig();
  
  const initializedRef = useRef(false);
  const googlePayContainerRef = useRef<HTMLDivElement>(null);
  const applePayContainerRef = useRef<HTMLDivElement>(null);
  const shippingAddressRef = useRef<AdyenAddress | undefined>(undefined);
  const billingAddressRef = useRef<AdyenAddress | undefined>(undefined);
  const productRef = useRef(product);
  const itemIdRef = useRef(itemId);

  const setShippingMethodMutation = useSetShippingMethod();
  const paymentInstructionsMutation = usePaymentInstructions();

  const returnUrl = createAbsoluteURL('/confirmation');

  // Find Adyen payment method from checkout
  const adyenPaymentMethod = checkoutData.checkout.paymentMethods?.find(
    (method) => method.name.toLowerCase().includes('adyen')
  );

  // Calculate total amount
  const grandTotal = checkoutData.checkout.totals.find(
    (total) => total.type === SelectionTotalRowType.GrandTotal
  )?.price.value ?? 0;

  const cartTotalInMinor = Math.round(grandTotal * 100);

  // Check if product is already in cart
  const hasProductInSelection = product 
    ? selectionData.lines.some((line) => line?.item.id === product.uri)
    : false;

  // Calculate line items for payment
  const initialLineItems = useMemo(() => {
    const items = selectionData.lines.map((line) => ({
      name: line?.displayItem.name ?? 'Product',
      price: line?.lineValue.value.toFixed(2) ?? '0.00',
    }));

    // Add product if not in cart yet
    if (product && !hasProductInSelection) {
      items.push({
        name: product.name,
        price: product.price.toFixed(2),
      });
    }

    return items;
  }, [selectionData.lines, product, hasProductInSelection]);

  const totalAmount = cartTotalInMinor + (!hasProductInSelection && product ? Math.round(product.price * 100) : 0);

  // Fetch payment configuration
  const { data: paymentConfig } = useQuery(
    expressCheckoutWidgetsQuery({
      pluginUri: adyenPaymentMethod?.uri,
      returnUrl: createAbsoluteURL('/confirmation'),
      amount: totalAmount,
      lineItems: initialLineItems,
    })
  );

  useEffect(() => {
    productRef.current = product;
    itemIdRef.current = itemId;
  }, [product, itemId]);

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
      phoneNumber: phoneNumber ?? '',
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

  const createApplePayLineItems = (
    totals: typeof checkoutData.checkout.totals,
    lines: typeof selectionData.lines
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

  const createGooglePayLineItems = (
    totals: typeof checkoutData.checkout.totals,
    lines: typeof selectionData.lines
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

  const setDefaultShippingMethod = async () => {
    const shippingMethods = checkoutData.checkout.shippingMethods ?? [];
    
    if (shippingMethods.length === 0) {
      throw new Error('No shipping methods available');
    }

    const defaultMethod = shippingMethods[0];
    if (defaultMethod) {
      await setShippingMethodMutation.mutateAsync(defaultMethod.id);
    }
  };

  const addressUpdateHandler = async (shippingAddress: google.payments.api.IntermediateAddress) => {
    try {
      await setDefaultShippingMethod();
      
      const address = {
        city: shippingAddress.locality ?? '',
        country: shippingAddress.countryCode ?? '',
        zipCode: shippingAddress.postalCode ?? '',
        state: shippingAddress.administrativeArea ?? '',
      };

      await paymentInstructionsMutation.mutateAsync({
        shippingAddress: {
          address1: '',
          ...address,
        },
        paymentReturnPage: createAbsoluteURL('/confirmation'),
        paymentFailedPage: createAbsoluteURL('/failed'),
        paymentInitiateOnly: true,
        express: true,
      });

      // Refetch checkout data
      const updatedCheckout = await queryClient.fetchQuery(checkoutQuery);
      const updatedSelection = await queryClient.fetchQuery(selectionQuery);
      const updatedSession = await queryClient.fetchQuery(sessionQuery);

      const grandTotal = updatedCheckout.checkout.totals.find(
        (t) => t.type === SelectionTotalRowType.GrandTotal
      )?.price.value ?? 0;

      return {
        currency: updatedSession.pricelist.currency.code,
        displayItems: createGooglePayLineItems(updatedCheckout.checkout.totals, updatedSelection.lines),
        grandTotalPriceAsNumber: grandTotal.toFixed(2),
        shippingMethodsAvailable: (updatedCheckout.checkout.shippingMethods ?? []).map((method) => ({
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
    await setShippingMethodMutation.mutateAsync(Number(shippingMethodId));
    
    const updatedCheckout = await queryClient.fetchQuery(checkoutQuery);
    const updatedSelection = await queryClient.fetchQuery(selectionQuery);
    const updatedSession = await queryClient.fetchQuery(sessionQuery);

    const grandTotal = updatedCheckout.checkout.totals.find(
      (t) => t.type === SelectionTotalRowType.GrandTotal
      )?.price.value ?? 0;

    return {
      currency: updatedSession.pricelist.currency.code,
      displayItems: createGooglePayLineItems(updatedCheckout.checkout.totals, updatedSelection.lines),
      grandTotalPriceAsNumber: grandTotal.toFixed(2),
    };
  };

  const googlePayPaymentDataChangedHandler: google.payments.api.PaymentDataChangedHandler = async ({
    callbackTrigger,
    shippingAddress,
    shippingOptionData,
  }) => {
      if (callbackTrigger === 'INITIALIZE') {
      // Add product to cart if needed
        const currentProduct = productRef.current;
      const currentItemId = itemIdRef.current;

      if (currentProduct && currentItemId && !hasProductInSelection) {
        // TODO: Add item to cart mutation
        // await addToCartMutation.mutateAsync({ item: currentItemId });
        }
      }

      if (callbackTrigger === 'INITIALIZE' || callbackTrigger === 'SHIPPING_ADDRESS') {
      const detail = await addressUpdateHandler(shippingAddress!);

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
      const detail = await handleGooglePayShippingMethodUpdate(shippingOptionData!.id);

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
      actions.reject({ intent: 'PAYMENT_AUTHORIZATION', message: 'Email is required', reason: 'PAYMENT_DATA_INVALID' });
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

  const handleOnSubmit = async (state: SubmitData, component: UIElement, actions: SubmitActions) => {
    const adyenShippingAddress = shippingAddressRef.current;
    const adyenBillingAddress = billingAddressRef.current;

    if (!isDefined(adyenShippingAddress) || !isDefined(adyenBillingAddress)) {
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
      const response = await paymentInstructionsMutation.mutateAsync({
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
        paymentReturnPage: createAbsoluteURL('/confirmation'),
        paymentFailedPage: createAbsoluteURL('/failed'),
        paymentMethodSpecificFields: state.data as unknown as Record<string, unknown>,
        express: true,
      });

      if (response.action) {
        actions.resolve({
          resultCode: 'Authorised',
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

  useEffect(() => {
    const init = async () => {
      if (!paymentConfig || (!googlePayContainerRef.current && !applePayContainerRef.current) || initializedRef.current) {
        return;
      }
      initializedRef.current = true;

      const checkout = await AdyenCheckout({
        amount: {
          currency: paymentConfig.paymentAmount.currency,
          value: paymentConfig.paymentAmount.amount,
        },
        clientKey: paymentConfig.clientKey,
        countryCode: paymentConfig.country,
        environment: paymentConfig.context,
        locale: paymentConfig.languageCode,
        paymentMethodsResponse: paymentConfig.paymentMethodsResponse as any,
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
        onAdditionalDetails: async (state) => {
          const form = document.createElement('form');
          form.method = 'post';
          form.action = returnUrl;

          const flattenForPost = (data: Record<string, unknown>, prefix = ''): Record<string, string> => {
            const result: Record<string, string> = {};
            for (const key in data) {
              const value = data[key];
              const newKey = prefix ? `${prefix}[${key}]` : key;
              if (typeof value === 'object' && value !== null) {
                Object.assign(result, flattenForPost(value as Record<string, unknown>, newKey));
              } else {
                result[newKey] = String(value);
              }
            }
            return result;
          };

          const flattenedItems = flattenForPost(state.data as Record<string, unknown>);
          Object.entries(flattenedItems).forEach(([name, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
          });

          form.style.position = 'absolute';
          form.style.left = '-100px';
          form.style.top = '-100px';
          document.body.appendChild(form);
          form.submit();
        },
        onAuthorized: onAuthorizedHandler,
        onPaymentCompleted: () => {
          window.location.href = returnUrl;
        },
        onSubmit: handleOnSubmit,
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
        onAdditionalDetails: async (state) => {
          const form = document.createElement('form');
          form.method = 'post';
          form.action = returnUrl;

          const flattenForPost = (data: Record<string, unknown>, prefix = ''): Record<string, string> => {
            const result: Record<string, string> = {};
            for (const key in data) {
              const value = data[key];
              const newKey = prefix ? `${prefix}[${key}]` : key;
              if (typeof value === 'object' && value !== null) {
                Object.assign(result, flattenForPost(value as Record<string, unknown>, newKey));
              } else {
                result[newKey] = String(value);
              }
            }
            return result;
          };

          const flattenedItems = flattenForPost(state.data as Record<string, unknown>);
          Object.entries(flattenedItems).forEach(([name, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
          });

          form.style.position = 'absolute';
          form.style.left = '-100px';
          form.style.top = '-100px';
          document.body.appendChild(form);
          form.submit();
        },
        onAuthorized: (payload, actions) => {
          const paymentData = payload.authorizedEvent.payment;
          const { shippingContact } = paymentData;
          const email = shippingContact?.emailAddress;
          const phoneNumber = shippingContact?.phoneNumber;

          if (!email || !phoneNumber || !paymentData.billingContact || !shippingContact) {
            actions.reject();
            return;
          }

          billingAddressRef.current = mapApplePayAddressToCentra(paymentData.billingContact, email, phoneNumber);
          shippingAddressRef.current = mapApplePayAddressToCentra(shippingContact, email, phoneNumber);
          actions.resolve();
        },
        onClick: async (resolve, reject) => {
          const currentProduct = productRef.current;
          const currentItemId = itemIdRef.current;

          if (currentProduct && currentItemId && !hasProductInSelection) {
            // TODO: Add item to cart mutation
            // await addToCartMutation.mutateAsync({ item: currentItemId });
          }

          if (selectionData.lines.length === 0) {
            reject(new Error('Selection is empty'));
            return;
          }

          resolve();
        },
        onShippingContactSelected: async (resolve, reject, event) => {
          const shippingAddress = event.shippingContact;

          if (shippingAddress.countryCode !== paymentConfig.country) {
            resolve({
              errors: [
                new (window as any).ApplePayError(
                  'shippingContactInvalid',
                  'countryCode',
                  'Cannot ship to the selected address'
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

          try {
            await paymentInstructionsMutation.mutateAsync({
              shippingAddress: {
                address1: '',
                ...address,
              },
              paymentReturnPage: createAbsoluteURL('/confirmation'),
              paymentFailedPage: createAbsoluteURL('/failed'),
              paymentInitiateOnly: true,
              express: true,
            });

            const updatedCheckout = await queryClient.fetchQuery(checkoutQuery);
            const updatedSelection = await queryClient.fetchQuery(selectionQuery);

            const grandTotal = updatedCheckout.checkout.totals.find(
              (t) => t.type === SelectionTotalRowType.GrandTotal
            )?.price.value ?? 0;

            const shippingMethods = (updatedCheckout.checkout.shippingMethods ?? []).map((method) => ({
              amount: method.price.value.toString(),
              detail: '',
              identifier: String(method.id),
              label: method.name,
            }));

            resolve({
              newLineItems: createApplePayLineItems(updatedCheckout.checkout.totals, updatedSelection.lines),
              newShippingMethods: shippingMethods,
              newTotal: {
                amount: grandTotal.toFixed(2),
                label: 'Total',
              },
            });
          } catch (error) {
            console.error('Shipping contact error:', error);
            reject();
          }
        },
        onShippingMethodSelected: async (resolve, reject, event) => {
          try {
            await setShippingMethodMutation.mutateAsync(Number(event.shippingMethod.identifier));

            const updatedCheckout = await queryClient.fetchQuery(checkoutQuery);
            const updatedSelection = await queryClient.fetchQuery(selectionQuery);

            const grandTotal = updatedCheckout.checkout.totals.find(
              (t) => t.type === SelectionTotalRowType.GrandTotal
            )?.price.value ?? 0;

            resolve({
              newLineItems: createApplePayLineItems(updatedCheckout.checkout.totals, updatedSelection.lines),
              newTotal: {
                amount: grandTotal.toFixed(2),
                label: 'Total',
              },
            });
          } catch (error) {
            console.error('Shipping method error:', error);
            reject();
          }
        },
        onSubmit: handleOnSubmit,
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
        .catch((error: Error) => {
          console.error('Apple Pay not available:', error.name, error.message);
        });
    };

    init();
  }, [paymentConfig, initialLineItems]);

  if (!adyenConfig.expressCheckoutEnabled) {
    return null;
  }

  return (
    <>
      <div ref={googlePayContainerRef} />
      <div ref={applePayContainerRef} />
    </>
  );
};
