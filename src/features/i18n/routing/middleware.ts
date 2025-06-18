import { NextRequest, NextResponse } from 'next/server';

import { apiTokenCookie, sessionCookie } from '@/lib/centra/cookies';
import { centraFetch } from '@/lib/centra/dtc-api/fetchers/session';
import { createSessionCookie, mapSession, verifySessionCookie } from '@/lib/centra/sessionCookie';
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
  ).catch(() => {
    // If API token is expired, create a new session
    return createSession(request, process.env.GQL_AUTHORIZATION);
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
  };
};

export const routingMiddleware = async (request: NextRequest) => {
  const url = parseLocale(request.nextUrl.pathname.split('/')[1] ?? '');

  // Get session from cookies or Centra
  let { session, apiToken, isFreshSession } = await getSession(request);

  // If country or language in URL doesn't match session, update session
  if (url.country && url.language && (session.country !== url.country || session.language !== url.language)) {
    isFreshSession = true;
    ({ session, apiToken } = await updateSession({
      apiToken,
      country: url.country,
      state: session.state,
      language: url.language,
    }));
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

  const response =
    request.nextUrl.pathname !== responsePathname
      ? NextResponse.redirect(new URL(`${responsePathname}${request.nextUrl.search}`, request.url))
      : NextResponse.next();

  if (isFreshSession) {
    // Cache the session in cookies
    response.cookies.set(await createSessionCookie(session));
  }

  response.cookies.set({
    ...apiTokenCookie,
    value: apiToken,
  });

  return response;
};
