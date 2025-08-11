import 'server-only';

import { jwtVerify, SignJWT } from 'jose';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { z } from 'zod';

import { DEFAULT_LANGUAGE } from '@/features/i18n/settings';
import { SessionFragment } from '@gql/graphql';

import { sessionCookie } from './cookies';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

const signSessionCookie = async (payload: Session) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${sessionCookie.maxAge}s`)
    .sign(encodedKey);
};

export const verifySessionCookie = cache(async (session: string | undefined = '') => {
  const { payload } = await jwtVerify(session, encodedKey, {
    algorithms: ['HS256'],
  });

  return sessionCookieSchema.parse(payload);
});

const sessionCookieSchema = z.object({
  country: z.string(),
  state: z.string().nullable(),
  language: z.string(),
  pricelist: z.number(),
  market: z.number(),
  isLoggedIn: z.boolean(),
});

type Session = z.infer<typeof sessionCookieSchema>;

export const getSession = async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(sessionCookie.name);

  if (!cookie) {
    throw new Error('Session cookie not found');
  }

  return verifySessionCookie(cookie.value);
};

export const mapSession = (session: SessionFragment): Session => ({
  country: session.country.code,
  state: session.countryState?.code ?? null,
  language: session.language?.code ?? DEFAULT_LANGUAGE.code,
  pricelist: session.pricelist.id,
  market: session.market.id,
  isLoggedIn: !!session.loggedIn,
});

export const createSessionCookie = async (session: Session): Promise<ResponseCookie> => {
  return {
    ...sessionCookie,
    value: await signSessionCookie(session),
  };
};
