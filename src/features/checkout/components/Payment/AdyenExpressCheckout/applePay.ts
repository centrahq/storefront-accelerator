import {
  ApplePay,
  Core,
  SubmitActions,
  SubmitData,
  UIElement
} from '@adyen/adyen-web';

import { addToCart } from '@/features/cart/service';
import { CheckoutQuery, SelectionTotalRowType } from '@gql/graphql';

import { PaymentConfigResponse } from '../../../queries';
import { fetchCheckout, setShippingMethod, submitPaymentInstructions } from '../../../service';
import { AdyenAddress } from '../types';
import { debugLog } from './debug';


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

const onApplePayClick = async (
  resolve: VoidFunction,
  reject: (error: Error) => void,
  getItemId: () => string | undefined,
  onAddedItemLineChange?: (lineId: string | null) => void,
) => {
  const itemId = getItemId();
  debugLog('applePay:onClick:input', { itemId });
  if (itemId) {
    try {
      const checkout = await fetchCheckout();
      debugLog('applePay:onClick:fetchCheckout', checkout);
      const hasProductInSelection = checkout.lines.some((line) => line?.item.id === itemId);

      if (!hasProductInSelection) {
        const addedSelection = await addToCart({ item: itemId });
        debugLog('applePay:onClick:addToCart:response', addedSelection);
        // Find the newly added item's line ID
        const addedItem = addedSelection.lines.find((line) => line?.item.id === itemId);
        if (addedItem) {
          onAddedItemLineChange?.(addedItem.id);
          debugLog('applePay:onClick:addedItemLine', { itemId, lineId: addedItem.id });
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

export const getApplePay = ({
  checkout,
  initialLineItems,
  getItemId,
  onAddedItemLineChange,
  onSubmit,
  paymentConfig,
}: {
  checkout: Core,
  initialLineItems: {
    name: string;
    price: string;
  }[],
  getItemId: () => string | undefined,
  onAddedItemLineChange: ((lineId: string | null) => void) | undefined,
  onSubmit: (
    state: SubmitData,
    actions: SubmitActions,
    billingAddress?: AdyenAddress,
    shippingAddress?: AdyenAddress,
  ) => Promise<void>,
  paymentConfig: PaymentConfigResponse,
}) => {
  let currentBillingAddress: AdyenAddress | undefined;
  let currentShippingAddress: AdyenAddress | undefined;
  const onShippingContactSelected = async (
    resolve: (data: ApplePayJS.ApplePayShippingContactUpdate) => void,
    reject: (error?: Error) => void,
    event: ApplePayJS.ApplePayShippingContactSelectedEvent,
    paymentConfig: PaymentConfigResponse,
  ) => {
    debugLog('applePay:onShippingContactSelected:input', { event, paymentConfig });
    const shippingAddress = event.shippingContact;

    const address = {
      city: shippingAddress.locality ?? '',
      country: shippingAddress.countryCode ?? '',
      state: shippingAddress.administrativeArea ?? '',
      zipCode: shippingAddress.postalCode ?? '',
    };
    if (shippingAddress.countryCode !== paymentConfig.country) {
      const data = await fetchCheckout();
      const shippingMethods = (data.checkout.shippingMethods ?? []).map((method) => ({
        amount: method.price.value.toString(),
        detail: '',
        identifier: String(method.id),
        label: method.name,
      }));
      const grandTotal =
        data.checkout.totals.find((t) => t.type === SelectionTotalRowType.GrandTotal)?.price.value ?? 0;
      const ret: ApplePayJS.ApplePayShippingContactUpdate = {
        errors: [
          new ApplePayError('shippingContactInvalid', 'countryCode', 'Cannot ship to the selected address')
        ],
        newLineItems: createApplePayLineItems(data.checkout.totals, data.lines),
        newShippingMethods: shippingMethods,
        newTotal: {
          amount: grandTotal.toFixed(2),
          label: 'Total',
        },
      };

      debugLog('applePay:onShippingContactSelected:resolve', ret);
      resolve(ret);
      return;
    }
    debugLog('applePay:onShippingContactSelected:centraAddress', address);
    submitPaymentInstructions({
      shippingAddress: {
        address1: '',
        ...address,
      },
      paymentReturnPage: `${window.location.origin}/success?express=true`,
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

  return new ApplePay(checkout, {
    buttonColor: 'black',
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
      currentBillingAddress = mapApplePayAddressToCentra(billingContact, shippingEmail, shippingPhoneNumber);
      currentShippingAddress = mapApplePayAddressToCentra(shippingContact, shippingEmail, shippingPhoneNumber);
      debugLog('applePay:onAuthorized:resolvedAddresses', {
        billingAddress: currentBillingAddress,
        shippingAddress: currentShippingAddress,
      });
      actions.resolve();
    },
    onClick: (resolve: VoidFunction, reject: (error: Error) => void) => {
      void onApplePayClick(resolve, reject, getItemId, onAddedItemLineChange);
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
      void onSubmit(state, actions, currentBillingAddress, currentShippingAddress);
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
};