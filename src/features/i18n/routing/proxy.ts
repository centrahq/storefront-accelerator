import { NextRequest, NextResponse } from 'next/server';

import { apiTokenCookie, sessionCookie } from '@/lib/centra/cookies';
import { CentraError } from '@/lib/centra/errors';
import { createSessionCookie, mapSession, verifySessionCookie } from '@/lib/centra/sessionCookie';
import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { checkUnavailableItems, REMOVED_ITEMS_PARAM } from '@/lib/utils/unavailableItems';
import { graphql } from '@gql/gql';

import { parseLocale, serializeLocale } from './localeParam';

const createSession = (request: NextRequest, apiToken: string) => {
  return centraFetch(
    graphql(`
      query session {
        session {
          ...session
        }
      }
    `),
    {
      apiToken,
      headers: {
        'x-forwarded-for': (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0] ?? '',
      },
    },
  );
};

const getSession = async (request: NextRequest) => {
  const cookieApiKey = request.cookies.get(apiTokenCookie.name);
  const cookieSession = request.cookies.get(sessionCookie.name);

  // If session cookie exists and is valid, return it
  if (cookieApiKey && cookieSession) {
    try {
      const session = await verifySessionCookie(cookieSession.value);

      return {
        session,
        apiToken: cookieApiKey.value,
        isFreshSession: false,
      };
    } catch {}
  }

  // If session cookie doesn't exist or is expired, fetch fresh session from Centra
  const sessionResponse = await createSession(
    request,
    request.cookies.get(apiTokenCookie.name)?.value ?? process.env.GQL_AUTHORIZATION,
  ).catch((error: unknown) => {
    // If API token is no longer valid, create a new session
    if (error instanceof CentraError && error.centraErrors.some((e) => e.message === 'Unauthorized')) {
      return createSession(request, process.env.GQL_AUTHORIZATION);
    }

    throw error;
  });

  return {
    session: mapSession(sessionResponse.data.session),
    apiToken: sessionResponse.extensions.token,
    isFreshSession: true,
  };
};

const updateSession = async ({
  language,
  country,
  state,
  apiToken,
}: {
  language: string;
  country: string;
  state: string | null;
  apiToken: string;
}) => {
  const changeCountryLanguageResponse = await centraFetch(
    graphql(`
      mutation setCountryAndLanguage($country: String!, $state: String, $language: String!) {
        setCountryState(countryCode: $country, stateCode: $state) {
          userErrors {
            __typename
            message
            path
          }
        }
        setLanguage(code: $language) {
          session {
            ...session
          }
        }
      }
    `),
    {
      variables: {
        country,
        state,
        language,
      },
      apiToken,
    },
  );

  return {
    apiToken: changeCountryLanguageResponse.extensions.token,
    session: mapSession(changeCountryLanguageResponse.data.setLanguage.session),
    hasUnavailableItems: checkUnavailableItems(changeCountryLanguageResponse.data.setCountryState.userErrors),
  };
};

/**
 * Proxy to handle routing and session based on locale.
 */
export const routingProxy = async (request: NextRequest) => {
  const url = parseLocale(request.nextUrl.pathname.split('/')[1] ?? '');

  // Get session from cookies or Centra
  let { session, apiToken, isFreshSession } = await getSession(request);
  let hasUnavailableItems = false;

  // If country or language in URL doesn't match session, update session
  if (url.country && url.language && (session.country !== url.country || session.language !== url.language)) {
    isFreshSession = true;
    const response = await updateSession({
      apiToken,
      country: url.country,
      state: session.state,
      language: url.language,
    });

    session = response.session;
    apiToken = response.apiToken;
    hasUnavailableItems = response.hasUnavailableItems;
  }

  const locale = serializeLocale(session);
  let responsePathname = request.nextUrl.pathname;

  // Update URL if language or country is missing or doesn't match session
  if (!url.language || !url.country) {
    responsePathname = `/${locale}${request.nextUrl.pathname}`;
  } else if (url.language !== session.language || url.country !== session.country) {
    responsePathname = request.nextUrl.pathname.replace(
      `/${serializeLocale({ language: url.language, country: url.country })}`,
      `/${locale}`,
    );
  }

  /* 
    Set the `removedItems` query parameter if some items were removed due to country change.
    This is used to display a toast notification after redirecting.
  */
  if (hasUnavailableItems) {
    request.nextUrl.searchParams.set(REMOVED_ITEMS_PARAM, 'true');
  }

  const response =
    request.nextUrl.pathname !== responsePathname || hasUnavailableItems
      ? NextResponse.redirect(new URL(`${responsePathname}${request.nextUrl.search}`, request.url))
      : NextResponse.next();

  if (isFreshSession) {
    // Store the session in cookies
    response.cookies.set(await createSessionCookie(session));
  }

  // Store the API token in cookies
  response.cookies.set({
    ...apiTokenCookie,
    value: apiToken,
  });

  return response;
};
