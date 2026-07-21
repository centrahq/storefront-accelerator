import { PaymentMethodsResponse } from '@adyen/adyen-web';
import { queryOptions } from '@tanstack/react-query';

import { ExpressCheckoutWidgetsQuery, ExpressCheckoutWidgetType } from '@gql/graphql';

import { getExpressCheckoutWidgets } from './components/Payment/AdyenExpressCheckout/actions';
import { fetchCheckout, fetchCheckoutPaymentMethods } from './service';

export const checkoutQuery = queryOptions({
  queryKey: ['checkout'],
  queryFn: fetchCheckout,
});

export const checkoutPaymentMethodsQuery = queryOptions({
  queryKey: ['checkout-payment-methods'],
  queryFn: fetchCheckoutPaymentMethods,
});

interface LineItem {
  name: string;
  price: string;
}

type WidgetTypeResponseMap = {
  [ExpressCheckoutWidgetType.ExpressCheckoutAdyen]: AdyenPaymentConfigResponse;
  [ExpressCheckoutWidgetType.ExpressCheckoutStripePaymentIntents]: StripePaymentConfigResponse;
};

interface ExpressCheckoutWidgetsParams<K extends ExpressCheckoutWidgetType> {
  type: K;
  returnUrl: string;
  amount: number;
  lineItems: LineItem[];
  language: string;
  market: number;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
}

interface PaymentAmount {
  amount: number;
  currency: string;
}

export interface AdyenPaymentConfigResponse {
  clientKey: string;
  context: 'test' | 'live' | 'live-us' | 'live-au' | 'live-apse' | 'live-in';
  country: string;
  languageCode: string;
  paymentAmount: PaymentAmount;
  paymentMethod: string;
  paymentMethodsResponse: PaymentMethodsResponse | undefined;
  billingPhoneNumberRequired: boolean;
  shippingPhoneNumberRequired: boolean;
  shippingMethods: ShippingMethod[];
}

export interface StripeParameters {
  captureMethod?: 'automatic' | 'automatic_async' | 'manual';
  country?: string;
  currency?: string;
  publishableKey?: string;
  returnUrl?: string;
}

export interface StripePaymentConfigResponse {
  publishableKey?: string;
  paymentMethod?: string;
  captureMethod?: 'automatic' | 'automatic_async' | 'manual';
  country?: string;
  currency?: string;
  languageCode?: string;
  phoneNumberRequired?: boolean;
  paymentAmount?: { amount: number; currency: string };
  shippingMethods?: Record<string, { id: string; uri: string; amount: number; displayName: string }>;
  stripeParameters?: string | StripeParameters;
}

export function expressCheckoutWidgetsQuery<K extends ExpressCheckoutWidgetType>({
  type,
  returnUrl,
  amount,
  lineItems,
  language,
  market,
}: ExpressCheckoutWidgetsParams<K>) {
  return queryOptions({
    queryKey: ['payment-configuration', language, market, { amount, lineItems, returnUrl, type }] as const,
    queryFn: async (): Promise<WidgetTypeResponseMap[K] | null> => {
      const data: ExpressCheckoutWidgetsQuery = await getExpressCheckoutWidgets({
        plugins: [
          {
            additionalData: {
              amount,
              lineItems,
              returnUrl,
            },
            type,
          },
        ],
      });
      const widget = data.expressCheckoutWidgets.list
        ?.flatMap((list) => list.widgets)
        .find((entry) => entry.name === type);
      return widget?.contents ? (JSON.parse(widget.contents) as WidgetTypeResponseMap[K]) : null;
    },
  });
}
