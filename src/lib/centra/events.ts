import { CartFragment, CheckoutFragment } from '@gql/graphql';

export class CentraPaymentResponseEvent extends CustomEvent<unknown> {
  constructor(payload: unknown) {
    super('centra_checkout_payment_response', { detail: payload });
  }
}

export interface ShippingUpdateResponseSuccess {
  country: string;
  currency: string;
  currencyDenominator: number;
  grandTotalPriceAsNumber: number;
  shippingMethod: string;
  shippingMethodsAvailable: Array<{
    name: string;
    price: string;
    priceAsNumber: number;
    shippingMethod: string;
  }>;
}

export interface ShippingUpdateResponseError {
  error: true;
}

export type CentraShippingResponsePayload = Partial<ShippingUpdateResponseSuccess> | ShippingUpdateResponseError;

const getShippingUpdateResponse = (
  selection: (CartFragment & CheckoutFragment) | null,
): CentraShippingResponsePayload => {
  const { checkout } = selection ?? {};

  if (!selection || !checkout) {
    return { error: true };
  }

  return {
    country: checkout.shippingAddress.country?.code,
    currency: selection.grandTotal.currency.code,
    currencyDenominator: selection.grandTotal.currency.denominator,
    grandTotalPriceAsNumber: selection.grandTotal.value,
    shippingMethod: String(checkout.shippingMethod?.id),
    shippingMethodsAvailable:
      checkout.shippingMethods?.map((method) => ({
        name: method.name,
        price: method.price.formattedValue,
        priceAsNumber: method.price.value,
        shippingMethod: String(method.id),
      })) ?? [],
  };
};

export class CentraShippingMethodResponseEvent extends CustomEvent<CentraShippingResponsePayload> {
  constructor(payload: (CartFragment & CheckoutFragment) | null) {
    super('centra_checkout_shipping_method_response', { detail: getShippingUpdateResponse(payload) });
  }
}

export class CentraShippingAddressResponseEvent extends CustomEvent<CentraShippingResponsePayload> {
  constructor(payload: (CartFragment & CheckoutFragment) | null) {
    super('centra_checkout_shipping_address_response', { detail: getShippingUpdateResponse(payload) });
  }
}
