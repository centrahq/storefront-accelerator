import type { ResultOf } from '@graphql-typed-document-node/core';
import type { TypedRequest } from '@centra/storefront';

import { CentraError } from '../../errors';
import { CentraResponse } from '../../types/api';
import { mutationMutex } from '../mutationLock';
import { getApiToken } from './session';

/**
 * `centraFetch` in the shape the `@centra/*` payment packages call: a typed document and its variables in, the
 * operation's data out. It sends the same session token, and queues mutations behind the store's own, since every
 * answer carries the whole selection and Centra must see one change at a time.
 *
 * The packages' documents are generated as strings, as this store's are, so the document is the query.
 */
export const centraRequest: TypedRequest = async (document, variables) => {
  if ('kind' in document) {
    throw new Error('centraRequest sends string documents only; print an AST document first.');
  }

  const query = document.toString();
  const send = async () => {
    const result = await fetch(process.env.NEXT_PUBLIC_GQL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await getApiToken()) ?? process.env.GQL_AUTHORIZATION}`,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    const body = (await result.json()) as CentraResponse<ResultOf<typeof document>>;

    if ('errors' in body) {
      throw new CentraError(body.errors, body.extensions?.traceId);
    }

    return body.data;
  };

  return query.trimStart().startsWith('mutation') ? mutationMutex.runExclusive(send) : send();
};
