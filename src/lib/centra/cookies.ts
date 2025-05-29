import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const sessionCookie = {
  name: 'session',
  path: '/',
  maxAge: 5 * 60,
  secure: true,
} satisfies Omit<ResponseCookie, 'value'>;

export const apiTokenCookie = {
  name: 'api-token',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
  secure: true,
} satisfies Omit<ResponseCookie, 'value'>;
