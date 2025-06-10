import { TypedDocumentString } from '@gql/graphql';

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

type Result<T> = {
  data: T;
  extensions: {
    token: string;
    traceId: string;
  };
};

/**
 * Fetches data from Centra DTC API with session. Can be used on client and server side.
 * Using this function in a layout or page will opt it into dynamic rendering.
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
export async function centraFetch<TResult>(
  query: TypedDocumentString<TResult, { [key: string]: never }>,
  options?: BaseRequest & { variables?: never },
): Promise<Result<TResult>>;
export async function centraFetch<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  options: BaseRequest & { variables: TVariables },
): Promise<Result<TResult>>;
export async function centraFetch<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  options?: BaseRequest & { variables?: TVariables },
): Promise<Result<TResult>> {
  const { apiToken, headers, variables, ...rest } = options ?? {};
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

  const body = (await result.json()) as CentraResponse<TResult>;

  if ('errors' in body) {
    throw new CentraError(body.errors, body.extensions?.traceId);
  }

  return body;
}
