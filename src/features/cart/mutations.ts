import { useMutation, useQueryClient } from '@tanstack/react-query';

import { centraFetch } from '@/lib/centra/dtc-api/fetchers/session';
import { mutationMutex } from '@/lib/centra/dtc-api/mutationLock';
import { UserError } from '@/lib/centra/errors';
import { graphql } from '@gql/gql';
import {
  AddFlexibleBundleToCartMutationVariables,
  AddItemMutationVariables,
  UpdateLineMutationVariables,
} from '@gql/graphql';

import { selectionQuery } from './queries';

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
    mutationFn: async (variables: AddItemMutationVariables) => {
      const response = await mutationMutex.runExclusive(() =>
        centraFetch(
          graphql(`
            mutation addItem($item: String!, $quantity: Int = 1, $subscriptionPlan: Int) {
              addItem(item: $item, quantity: $quantity, subscriptionPlan: $subscriptionPlan) {
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

      if (response.data.addItem.userErrors.length > 0) {
        throw new UserError(response.data.addItem.userErrors, response.extensions.traceId);
      }

      if (!response.data.addItem.selection) {
        throw new Error('No selection');
      }

      return response.data.addItem.selection;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(selectionQuery.queryKey, data);
    },
  });
};

export const useUpdateLine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['selection', 'updateLine'],
    mutationFn: async (variables: UpdateLineMutationVariables) => {
      const response = await mutationMutex.runExclusive(() =>
        centraFetch(
          graphql(`
            mutation updateLine($id: String!, $quantity: Int!, $subscriptionPlanId: Int) {
              updateLine(lineId: $id, quantity: $quantity, subscriptionPlanId: $subscriptionPlanId) {
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

      if (response.data.updateLine.userErrors.length > 0) {
        throw new UserError(response.data.updateLine.userErrors, response.extensions.traceId);
      }

      if (!response.data.updateLine.selection) {
        throw new Error('No selection');
      }

      return response.data.updateLine.selection;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(selectionQuery.queryKey, data);
    },
  });
};
