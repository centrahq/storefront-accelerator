import { PaymentMethodsResponse } from '@adyen/adyen-web';
import { queryOptions } from '@tanstack/react-query';

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
  pluginUri: string | undefined;
  returnUrl: string;
  amount: number;
  lineItems: LineItem[];
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

interface ExpressCheckoutWidget {
  id?: string | null;
  name: string;
  contents?: string | null;
  error?: string | null;
}

interface ExpressCheckoutWidgetsData {
  expressCheckoutWidgets: {
    list?: Array<{
      name: string;
      widgets: ExpressCheckoutWidget[];
    }> | null;
    userErrors: Array<{
      message: string;
      path?: string[] | null;
    }>;
  };
}

export function expressCheckoutWidgetsQuery({ pluginUri, returnUrl, amount, lineItems }: ExpressCheckoutWidgetsParams) {
  return queryOptions({
    queryKey: ['express-checkout-widgets', pluginUri, returnUrl, amount, lineItems],
    enabled: !!pluginUri,
    queryFn: async () => {
      const response = await fetch('/api/express-checkout-widgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plugins: [
            {
              additionalData: {
                amount,
                lineItems,
                returnUrl,
              },
              uri: pluginUri,
            },
          ],
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(error?.error ?? 'Failed to fetch express checkout widgets');
      }

      const data = (await response.json()) as ExpressCheckoutWidgetsData;
      const pluginList = data.expressCheckoutWidgets.list?.find((list) => list.name === pluginUri);
      const widget = pluginList?.widgets[0];

      return widget?.contents ? (JSON.parse(widget.contents) as PaymentConfigResponse) : undefined;
    },
  });
}
