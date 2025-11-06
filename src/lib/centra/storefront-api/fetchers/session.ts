import { ResultOf, VariablesOf } from '@graphql-typed-document-node/core';

import { apiTokenCookie } from '../../cookies';
import { CentraError } from '../../errors';
import { CentraResponse } from '../../types/api';

const getApiToken = async () => {
  if (typeof document === 'undefined') {
    const { cookies } = await import('next/headers');

    return (await cookies()).get(apiTokenCookie.name)?.value;
  }

  for (const cookie of document.cookie.split(';')) {
    const [cookieName, value] = cookie.split('=') as [string, string];
    if (cookieName.trimStart() === apiTokenCookie.name) {
      return decodeURIComponent(value);
    }
  }
};

type BaseRequest = Omit<RequestInit, 'body' | 'method' | 'cache' | 'headers'> & {
  apiToken?: string;
  headers?: Record<string, string>;
};

/**
 * Fetches data from Centra Storefront API with session. Can be used on client and server side.
 * API token can be provided, if it's not provided it will be taken from cookies.
 * Use `graphql` function to get type safety.
 *
 * @example
 * centraFetch(graphql(`
 *   query receipt {
 *     order {
 *       id
 *     }
 *   }
 * `))
 */
export async function centraFetch<T>(
  query: T,
  ...options: VariablesOf<T> extends { [key: string]: never }
    ? [options?: BaseRequest & { variables?: VariablesOf<T> }]
    : [options: BaseRequest & { variables: VariablesOf<T> }]
) {
  const { apiToken, headers, variables, ...rest } = options[0] ?? {};
  const result = await fetch(process.env.NEXT_PUBLIC_GQL_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken ?? (await getApiToken()) ?? process.env.GQL_AUTHORIZATION}`,
      ...headers,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
    ...rest,
  });

  const body = (await result.json()) as CentraResponse<ResultOf<T>>;

  if ('errors' in body) {
    throw new CentraError(body.errors, body.extensions?.traceId);
  }

  return body;
}
