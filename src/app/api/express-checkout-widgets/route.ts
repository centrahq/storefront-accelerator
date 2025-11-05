import { NextRequest, NextResponse } from 'next/server';

import { apiTokenCookie } from '@/lib/centra/cookies';
import { centraFetch } from '@/lib/centra/dtc-api/fetchers/session';
import { graphql } from '@gql/gql';
import { ExpressCheckoutWidgetsPluginItem } from '@gql/graphql';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plugins } = body as {
      plugins: ExpressCheckoutWidgetsPluginItem[];
    };

    // Get session token from cookies
    const sessionToken = request.cookies.get(apiTokenCookie.name)?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Session token not found' }, { status: 401 });
    }

    // Get shared secret from environment
    const sharedSecret = process.env.GQL_SHARED_SECRET;

    if (!sharedSecret) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    // Fetch data using centraFetch with custom headers
    const response = await centraFetch(
      graphql(`
        query ExpressCheckoutWidgets($configurationOnly: Boolean!, $plugins: [ExpressCheckoutWidgetsPluginItem!]!) {
          expressCheckoutWidgets(configurationOnly: $configurationOnly, plugins: $plugins) {
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
          configurationOnly: true,
          plugins,
        },
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
          'X-Shared-Secret': sharedSecret,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Express checkout widgets error:', error);
    return NextResponse.json({ error: 'Failed to fetch express checkout widgets' }, { status: 500 });
  }
}
