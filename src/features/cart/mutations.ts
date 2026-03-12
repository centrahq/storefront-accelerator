import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserError } from '@/lib/centra/errors';
import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { mutationMutex } from '@/lib/centra/storefront-api/mutationLock';
import { graphql } from '@gql/gql';
import { AddFlexibleBundleToCartMutationVariables } from '@gql/graphql';

import { selectionQuery } from './queries';
import { addToCart, updateLine } from './service';

export const useAddFlexibleBundleToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['selection', 'addFlexibleBundleToCart'],
    mutationFn: async (variables: AddFlexibleBundleToCartMutationVariables) => {
      const response = await mutationMutex.runExclusive(() =>
        centraFetch(
          graphql(`
            mutation addFlexibleBundleToCart(
              $item: String!
              $sections: [BundleSectionInput!]!
              $quantity: Int = 1
              $subscriptionPlan: Int
            ) {
              addFlexibleBundle(
                item: $item
                quantity: $quantity
                sections: $sections
                subscriptionPlan: $subscriptionPlan
              ) {
                userErrors {
                  message
                  path
                }
                selection {
                  ...cart
                }
              }
            }
          `),
          {
            variables,
          },
        ),
      );

      if (response.data.addFlexibleBundle.userErrors.length > 0) {
        throw new UserError(response.data.addFlexibleBundle.userErrors, response.extensions.traceId);
      }

      if (!response.data.addFlexibleBundle.selection) {
        throw new Error('No selection');
      }

      return response.data.addFlexibleBundle.selection;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(selectionQuery.queryKey, data);
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['selection', 'addToCart'],
    mutationFn: addToCart,
    onSuccess: (data) => {
      queryClient.setQueryData(selectionQuery.queryKey, data);
    },
  });
};

export const useUpdateLine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['selection', 'updateLine'],
    mutationFn: updateLine,
    onSuccess: (data) => {
      queryClient.setQueryData(selectionQuery.queryKey, data);
    },
  });
};
