import { NextRequest, NextResponse } from 'next/server';

import { apiTokenCookie } from '@/lib/centra/cookies';
import { UserError } from '@/lib/centra/errors';
import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { graphql } from '@gql/gql';
import { ExpressCheckoutWidgetsPluginItem } from '@gql/graphql';

export async function POST(request: NextRequest) {
  try {
    const { plugins } = (await request.json()) as {
      plugins: ExpressCheckoutWidgetsPluginItem[];
    };

    // Get API token from cookies
    const apiToken = request.cookies.get(apiTokenCookie.name)?.value;

    if (!apiToken) {
      return NextResponse.json({ error: 'API token not found' }, { status: 401 });
    }

    // Get shared secret from environment
    const sharedSecret = process.env.GQL_SHARED_SECRET;

    if (!sharedSecret) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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

    if (response.data.expressCheckoutWidgets.userErrors[0]) {
      console.error('Express checkout widgets error:', new UserError(response.data.expressCheckoutWidgets.userErrors));
      return NextResponse.json({ error: response.data.expressCheckoutWidgets.userErrors[0].message }, { status: 500 });
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Express checkout widgets error:', error);
    return NextResponse.json({ error: 'Failed to fetch express checkout widgets' }, { status: 500 });
  }
}
