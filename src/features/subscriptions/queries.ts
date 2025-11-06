import { queryOptions } from '@tanstack/react-query';

import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { graphql } from '@gql/gql';

export const subscriptionsContractsQuery = queryOptions({
  queryKey: ['subscription-contracts'],
  queryFn: async () => {
    const response = await centraFetch(
      graphql(`
        query subscriptionContracts {
          customer {
            subscriptionContracts {
              ...subscriptionContract
            }
          }
        }
      `),
    );

    return response.data.customer?.subscriptionContracts ?? [];
  },
});
