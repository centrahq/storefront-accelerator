import {
  AddressData,
  Core,
  GooglePay,
  SubmitActions,
  SubmitData,
  UIElement
} from '@adyen/adyen-web';

import { addToCart } from '@/features/cart/service';
import { SelectionTotalRowType } from '@gql/graphql';

import { PaymentConfigResponse } from '../../../queries';
import type { CheckoutSelection } from '../../../service';
import { fetchCheckout, setShippingMethod, submitPaymentInstructions } from '../../../service';

import { AdyenAddress } from "../types";
import { debugLog } from './debug';
import { formatMinorToMajor } from './helpers';

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
  totals: CheckoutSelection['checkout']['totals'],
  lines: CheckoutSelection['lines'],
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
  onAddressResolved: (billingAddress: AdyenAddress, shippingAddress: AdyenAddress) => void,
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
  const adyenBillingAddress = mapAdyenAddressToCentra(billingAddress, email);
  const adyenShippingAddress = mapAdyenAddressToCentra(shippingAddress, email);
  debugLog('googlePay:onAuthorized:resolvedAddresses', {
    billingAddress: adyenBillingAddress,
    shippingAddress: adyenShippingAddress,
  });
  onAddressResolved(adyenBillingAddress, adyenShippingAddress);
  actions.resolve();
};

export const getGooglePay = ({
  checkout,
  paymentConfig,
  initialLineItems,
  handleOnSubmit,
  getItemId,
  onAddedItemLineChange,
}: {
  checkout: Core,
  paymentConfig: PaymentConfigResponse,
  initialLineItems: {
    name: string;
    price: string;
  }[],
  handleOnSubmit: (
    state: SubmitData,
    actions: SubmitActions,
    billingAddress?: AdyenAddress,
    shippingAddress?: AdyenAddress,
  ) => Promise<void>,
  getItemId: () => string | undefined,
  onAddedItemLineChange?: (lineId: string | null) => void,
}) => {
  let currentBillingAddress: AdyenAddress | undefined;
  let currentShippingAddress: AdyenAddress | undefined;

  const addressUpdateHandler = async (shippingAddress: google.payments.api.IntermediateAddress) => {
    try {
      debugLog('addressUpdateHandler:input', { shippingAddress });

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
        paymentReturnPage: `${window.location.origin}/success?express=true`,
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
      const currentItemId = getItemId();
      if (currentItemId) {
        try {
          const data = await fetchCheckout(true);
          debugLog('googlePayPaymentDataChangedHandler:INITIALIZE:fetchCheckout', data);
          const hasProductInSelection = data.lines.some((line) => line?.item.id === currentItemId);

          if (!hasProductInSelection) {
            const addedSelection = await addToCart({ item: currentItemId });
            debugLog('googlePayPaymentDataChangedHandler:INITIALIZE:addToCart:response', addedSelection);
            // Find the newly added item's line ID
            const addedItem = addedSelection.lines.find((line) => line?.item.id === currentItemId);
            if (addedItem) {
              onAddedItemLineChange?.(addedItem.id);
              debugLog('googlePayPaymentDataChangedHandler:INITIALIZE:addedItemLine', {
                itemId: currentItemId,
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

  const onAddressResolved = (billingAddress: AdyenAddress, shippingAddress: AdyenAddress) => {
    currentBillingAddress = billingAddress;
    currentShippingAddress = shippingAddress;
  };

  return new GooglePay(checkout, {
    billingAddressParameters: {
      format: 'FULL',
      phoneNumberRequired: paymentConfig.billingPhoneNumberRequired,
    },
    billingAddressRequired: true,
    callbackIntents: ['SHIPPING_ADDRESS', 'SHIPPING_OPTION'],
    emailRequired: true,
    isExpress: true,
    onAuthorized: (payload, actions) => {
      onAuthorizedHandler(payload, actions, onAddressResolved);
    },
    onSubmit: (state: SubmitData, _component: UIElement, actions: SubmitActions) => {
      debugLog('googlePay:onSubmit:called', { stateData: state.data });
      void handleOnSubmit(state, actions, currentBillingAddress, currentShippingAddress);
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
      totalPrice: formatMinorToMajor(paymentConfig.paymentAmount.amount),
      totalPriceLabel: 'Total',
      totalPriceStatus: 'FINAL',
    },
  });
};