'use server';

import { cookies } from 'next/headers';

import { apiTokenCookie } from '@/lib/centra/cookies';
import { UserError } from '@/lib/centra/errors';
import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { graphql } from '@gql/gql';
import { ExpressCheckoutWidgetsPluginItem, ExpressCheckoutWidgetsQuery } from '@gql/graphql';

export type GetExpressCheckoutWidgetsParams = {
  plugins: ExpressCheckoutWidgetsPluginItem[];
};

export async function getExpressCheckoutWidgets(
  params: GetExpressCheckoutWidgetsParams,
): Promise<ExpressCheckoutWidgetsQuery> {
  const { plugins } = params;

  const cookieStore = await cookies();
  const apiToken = cookieStore.get(apiTokenCookie.name)?.value;

  if (!apiToken) {
    throw new Error('API token not found');
  }

  const sharedSecret = process.env.GQL_SHARED_SECRET;
  if (!sharedSecret) {
    throw new Error('Internal server error');
  }

  const response = await centraFetch(
    graphql(`
      query expressCheckoutWidgets($plugins: [ExpressCheckoutWidgetsPluginItem!]!) {
        expressCheckoutWidgets(configurationOnly: true, plugins: $plugins) {
          list {
            name
            widgets {
              id
              name
              contents
              error
            }
          }
          userErrors {
            message
            path
          }
        }
      }
    `),
    {
      variables: {
        plugins,
      },
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'X-Shared-Secret': sharedSecret,
      },
    },
  );

  const firstError = response.data.expressCheckoutWidgets.userErrors[0];
  if (firstError) {
    console.error('Express checkout widgets error:', new UserError(response.data.expressCheckoutWidgets.userErrors));
    throw new Error(firstError.message);
  }

  return response.data;
}
