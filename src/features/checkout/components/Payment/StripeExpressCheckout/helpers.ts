import {
  BillingDetails,
  ShippingAddress,
  ShippingRate,
  StripeExpressCheckoutElementConfirmEvent,
} from '@stripe/stripe-js';

import { AddressInput, SelectionTotalRowType } from '@gql/graphql';

import { type StripeParameters, type StripePaymentConfigResponse } from '../../../queries';

export type StripeFormFields = {
  publishableKey?: string;
  clientSecret?: string;
  stripeParameters?: string | StripeParameters;
};

export type StripeConfig = {
  publishableKey: string;
  clientSecret: string;
  stripeParameters: StripeParameters;
};

export type StripeLineItem = {
  amount: number;
  name: string;
};

type StripeAddressShape = {
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  postal_code?: string;
  state?: string;
};

export const isNonEmptyString = (value?: string | null): value is string =>
  typeof value === 'string' && value.trim() !== '';

export const parseStripeParameters = (rawStripeParameters?: StripeFormFields['stripeParameters']): StripeParameters => {
  if (typeof rawStripeParameters === 'string') {
    try {
      return JSON.parse(rawStripeParameters) as StripeParameters;
    } catch {
      return {};
    }
  }
  return rawStripeParameters ?? {};
};

export const getStripeConfig = (
  action?: { __typename: string; formFields?: Record<string, unknown> | null; formType?: string } | null,
): StripeConfig | null => {
  if (action?.__typename !== 'FormPaymentAction' || action.formType !== 'stripe-payment-intents') {
    return null;
  }

  const formFields = action.formFields as StripeFormFields | undefined;
  if (!isNonEmptyString(formFields?.publishableKey) || !isNonEmptyString(formFields.clientSecret)) {
    return null;
  }

  return {
    clientSecret: formFields.clientSecret,
    publishableKey: formFields.publishableKey,
    stripeParameters: parseStripeParameters(formFields.stripeParameters),
  };
};

export const mapShippingMethodsToStripeRatesFromCheckout = (
  shippingMethods: Array<{ id: number; name: string; price: { value: number } }>,
): ShippingRate[] => {
  return shippingMethods.map((shippingMethod) => ({
    amount: Math.round(shippingMethod.price.value * 100),
    displayName: shippingMethod.name,
    id: String(shippingMethod.id),
  }));
};

export const mapShippingMethodsToStripeRatesFromConfig = (
  shippingMethods?: StripePaymentConfigResponse['shippingMethods'],
): ShippingRate[] => {
  if (!shippingMethods) {
    return [];
  }
  return Object.values(shippingMethods)
    .filter((shippingMethod) => isNonEmptyString(shippingMethod.id))
    .map((shippingMethod) => ({
      amount: Math.round(shippingMethod.amount * 100),
      displayName: shippingMethod.displayName,
      id: shippingMethod.id,
    }));
};

const getCheckoutTotalValue = (
  totals: Array<{ type: SelectionTotalRowType; price: { value: number } }>,
  type: SelectionTotalRowType,
) => {
  return totals.find((total) => total.type === type)?.price.value ?? 0;
};

export const createStripeLineItems = (
  totals: Array<{ type: SelectionTotalRowType; price: { value: number } }>,
): Array<{ name: string; amount: number }> => {
  return [
    {
      amount: Math.round(getCheckoutTotalValue(totals, SelectionTotalRowType.ItemsSubtotal) * 100),
      name: 'Subtotal',
    },
    {
      amount: Math.round(getCheckoutTotalValue(totals, SelectionTotalRowType.Discount) * 100),
      name: 'Discount',
    },
    {
      amount: Math.round(getCheckoutTotalValue(totals, SelectionTotalRowType.Shipping) * 100),
      name: 'Shipping',
    },
  ];
};

export const getCheckoutTotalAmountInMinor = (
  totals: Array<{ type: SelectionTotalRowType; price: { value: number } }>,
): number => {
  return Math.round(getCheckoutTotalValue(totals, SelectionTotalRowType.GrandTotal) * 100);
};

const getStringValue = (value?: string | null): string | undefined => {
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
};

const getStripeAddressValue = (
  address?: BillingDetails['address'],
  key?: keyof StripeAddressShape,
): string | undefined => {
  if (!address || !key) {
    return undefined;
  }
  return getStringValue(address[key] ?? undefined);
};

const splitFullName = (name?: string) => {
  if (!isNonEmptyString(name)) {
    return { firstName: undefined, lastName: undefined };
  }
  const [firstName, ...lastNameParts] = name.trim().split(/\s+/);
  return {
    firstName,
    lastName: lastNameParts.length > 0 ? lastNameParts.join(' ') : undefined,
  };
};

export const mapStripeBillingDetailsToAddress = (billingDetails?: BillingDetails): AddressInput | undefined => {
  if (!billingDetails) {
    return undefined;
  }
  const { firstName, lastName } = splitFullName(getStringValue(billingDetails.name));
  return {
    address1: getStripeAddressValue(billingDetails.address, 'line1'),
    address2: getStripeAddressValue(billingDetails.address, 'line2'),
    city: getStripeAddressValue(billingDetails.address, 'city'),
    country: getStripeAddressValue(billingDetails.address, 'country') ?? '',
    email: getStringValue(billingDetails.email),
    firstName,
    lastName,
    phoneNumber: getStringValue(billingDetails.phone),
    state: getStripeAddressValue(billingDetails.address, 'state'),
    zipCode: getStripeAddressValue(billingDetails.address, 'postal_code'),
  };
};

export const mapStripeShippingAddress = (shippingAddress?: ShippingAddress): AddressInput | undefined => {
  if (!shippingAddress) {
    return undefined;
  }
  const { firstName, lastName } = splitFullName(getStringValue(shippingAddress.name));
  return {
    address1: getStripeAddressValue(shippingAddress.address, 'line1'),
    address2: getStripeAddressValue(shippingAddress.address, 'line2'),
    city: getStripeAddressValue(shippingAddress.address, 'city'),
    country: getStripeAddressValue(shippingAddress.address, 'country') ?? '',
    firstName,
    lastName,
    state: getStripeAddressValue(shippingAddress.address, 'state'),
    zipCode: getStripeAddressValue(shippingAddress.address, 'postal_code'),
  };
};

export const getConfirmAddresses = (event: StripeExpressCheckoutElementConfirmEvent) => {
  return {
    billingAddress: mapStripeBillingDetailsToAddress(event.billingDetails),
    shippingAddress: mapStripeShippingAddress(event.shippingAddress),
  };
};
