import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { DEFAULT_LANGUAGE } from '@/features/i18n/settings';
import { SessionFragment } from '@gql/graphql';

import { sessionCookie } from './cookies';

export const sessionCookieSchema = z.object({
  country: z.string(),
  state: z.string().nullable(),
  language: z.string(),
  pricelist: z.number(),
  market: z.number(),
  isLoggedIn: z.boolean(),
});

export type SessionCookie = z.infer<typeof sessionCookieSchema>;

export const getSession = async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(sessionCookie.name);

  if (!cookie) {
    throw new Error('Session cookie not found');
  }

  return JSON.parse(cookie.value) as SessionCookie;
};

export const mapSession = (session: SessionFragment): SessionCookie => ({
  country: session.country.code,
  state: session.countryState?.code ?? null,
  language: session.language?.code ?? DEFAULT_LANGUAGE.code,
  pricelist: session.pricelist.id,
  market: session.market.id,
  isLoggedIn: !!session.loggedIn,
});

export const createSessionCookie = (session: SessionFragment | SessionCookie): ResponseCookie => {
  return {
    ...sessionCookie,
    value: JSON.stringify('isLoggedIn' in session ? session : mapSession(session)),
  };
};
