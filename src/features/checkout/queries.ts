import { PaymentMethodsResponse } from '@adyen/adyen-web';
import { queryOptions } from '@tanstack/react-query';
import { ExpressCheckoutWidgetType, ExpressCheckoutWidgetsQuery } from '@gql/graphql';

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

interface ExpressCheckoutWidgetsParams {
  type: ExpressCheckoutWidgetType.ExpressCheckoutAdyen;
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

export interface PaymentConfigResponse {
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

export function expressCheckoutWidgetsQuery({
  type,
  returnUrl,
  amount,
  lineItems,
  language,
  market,
}: ExpressCheckoutWidgetsParams) {
  return queryOptions({
    queryKey: ['payment-configuration', language, market, { amount, lineItems, returnUrl, type }],
    queryFn: async () => {
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
      const widget = data.expressCheckoutWidgets.list?.flatMap((list) => list.widgets).find((entry) => entry.name === type);
      return widget?.contents ? (JSON.parse(widget.contents) as PaymentConfigResponse) : null;
    },
  });
}
