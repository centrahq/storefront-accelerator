import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const sessionCookie = {
  name: 'session',
  path: '/',
  maxAge: 60 * 60,
  sameSite: 'lax',
  secure: true,
} satisfies Omit<ResponseCookie, 'value'>;

export const apiTokenCookie = {
  name: 'api-token',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
  sameSite: 'lax',
  secure: true,
} satisfies Omit<ResponseCookie, 'value'>;
