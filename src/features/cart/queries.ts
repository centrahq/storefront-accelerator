import { queryOptions } from '@tanstack/react-query';

import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { graphql } from '@gql/gql';

export const selectionQuery = queryOptions({
  queryKey: ['selection'],
  queryFn: async () => {
    const response = await centraFetch(
      graphql(`
        query cart {
          selection {
            ...cart
          }
        }
      `),
    );

    return response.data.selection;
  },
});
