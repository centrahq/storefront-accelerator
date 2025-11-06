import { queryOptions } from '@tanstack/react-query';

import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { graphql } from '@gql/gql';

export const checkoutQuery = queryOptions({
  queryKey: ['checkout'],
  queryFn: async () => {
    const response = await centraFetch(
      graphql(`
        query checkout {
          selection {
            ...checkout
          }
        }
      `),
    );

    if (!response.data.selection.checkout) {
      throw new Error('Checkout not found');
    }

    return {
      ...response.data.selection,
      checkout: response.data.selection.checkout,
    };
  },
});
