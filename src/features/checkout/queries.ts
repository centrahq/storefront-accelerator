import { queryOptions } from '@tanstack/react-query';

import { centraFetch } from '@/lib/centra/dtc-api/fetchers/session';
import { graphql } from '@gql/gql';

export const checkoutQuery = queryOptions({
  queryKey: ['checkout'],
  queryFn: async () => {
    const response = await centraFetch(
      graphql(`
        query checkout {
          selection {
            ...checkout
          }
        }
      `),
    );

    if (!response.data.selection.checkout) {
      throw new Error('Checkout not found');
    }

    return {
      ...response.data.selection,
      checkout: response.data.selection.checkout,
    };
  },
});

interface SessionData {
  country: { code: string };
  countryState?: { code: string } | null;
  language?: { code: string } | null;
  market: { id: number };
  pricelist: {
    id: number;
    currency: { code: string };
  };
}

export const sessionQuery = queryOptions({
  queryKey: ['session'],
  queryFn: async (): Promise<SessionData> => {
    // Use raw GraphQL query string with centraFetch's underlying mechanism
    const query = `
      query SessionWithCurrency {
        session {
          country {
            code
          }
          countryState {
            code
          }
          language {
            code
          }
          market {
            id
          }
          pricelist {
            id
            currency {
              code
            }
          }
        }
      }
    `;

    // Get API token from cookies (client) or use default (server)
    const getApiToken = async () => {
      if (typeof document === 'undefined') {
        const { cookies } = await import('next/headers');
        const { apiTokenCookie } = await import('@/lib/centra/cookies');
        return (await cookies()).get(apiTokenCookie.name)?.value;
      }

      // Client-side: get from document.cookie
      const { apiTokenCookie } = await import('@/lib/centra/cookies');
      for (const cookie of document.cookie.split(';')) {
        const [cookieName, value] = cookie.split('=') as [string, string];
        if (cookieName.trimStart() === apiTokenCookie.name) {
          return decodeURIComponent(value);
        }
      }
    };

    const apiToken = await getApiToken();

    const result = await fetch(process.env.NEXT_PUBLIC_GQL_API!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken ?? process.env.GQL_AUTHORIZATION}`,
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    const response = (await result.json()) as { data: { session: SessionData } };
    return response.data.session;
  },
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
  paymentMethodsResponse: unknown;
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
        const error = await response.json();
        throw new Error(error?.error || 'Failed to fetch express checkout widgets');
      }

      return response.json() as Promise<ExpressCheckoutWidgetsData>;
    },
    select: (data): PaymentConfigResponse | undefined => {
      if (!pluginUri) {
        return;
      }

      const pluginList = data.expressCheckoutWidgets.list?.find(list => list.name === pluginUri);
      const widget = pluginList?.widgets[0];

      return widget?.contents ? (JSON.parse(widget.contents) as PaymentConfigResponse) : undefined;
    },
    enabled: !!pluginUri,
  });
}
