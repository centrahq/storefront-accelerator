import { useMutation, useQueryClient } from '@tanstack/react-query';

import { centraFetch } from '@/lib/centra/dtc-api/fetchers/session';
import { UserError } from '@/lib/centra/errors';
import { graphql } from '@gql/gql';
import {
  AddFlexibleBundleToCartMutationVariables,
  AddItemMutationVariables,
  UpdateLineMutationVariables,
} from '@gql/graphql';

import { checkoutQuery } from '../checkout/queries';
import { selectionQuery } from './queries';

export const useAddFlexibleBundleToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['selection', 'addFlexibleBundleToCart'],
    mutationFn: async (variables: AddFlexibleBundleToCartMutationVariables) => {
      const response = await centraFetch(
        graphql(`
          mutation addFlexibleBundleToCart($item: String!, $sections: [BundleSectionInput!]!, $quantity: Int = 1) {
            addFlexibleBundle(item: $item, quantity: $quantity, sections: $sections) {
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
      );

      if (response.data.addFlexibleBundle.userErrors.length > 0) {
        throw new UserError(response.data.addFlexibleBundle.userErrors, response.extensions.traceId);
      }

      if (!response.data.addFlexibleBundle.selection) {
        throw new Error('No selection');
      }

      return response.data.addFlexibleBundle.selection;
    },
    onMutate: () => {
      window.CentraCheckout?.suspend();
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(checkoutQuery);
      queryClient.setQueryData(selectionQuery.queryKey, data);
    },
    onSettled: () => window.CentraCheckout?.resume(),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['selection', 'addToCart'],
    mutationFn: async (variables: AddItemMutationVariables) => {
      const response = await centraFetch(
        graphql(`
          mutation addItem($item: String!, $quantity: Int = 1) {
            addItem(item: $item, quantity: $quantity) {
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
      );

      if (response.data.addItem.userErrors.length > 0) {
        throw new UserError(response.data.addItem.userErrors, response.extensions.traceId);
      }

      if (!response.data.addItem.selection) {
        throw new Error('No selection');
      }

      return response.data.addItem.selection;
    },
    onMutate: () => {
      window.CentraCheckout?.suspend();
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(checkoutQuery);
      queryClient.setQueryData(selectionQuery.queryKey, data);
    },
    onSettled: () => window.CentraCheckout?.resume(),
  });
};

export const useUpdateLine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['selection', 'updateLine'],
    mutationFn: async (variables: UpdateLineMutationVariables) => {
      const response = await centraFetch(
        graphql(`
          mutation updateLine($id: String!, $quantity: Int!) {
            updateLine(lineId: $id, quantity: $quantity) {
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
      );

      if (response.data.updateLine.userErrors.length > 0) {
        throw new UserError(response.data.updateLine.userErrors, response.extensions.traceId);
      }

      if (!response.data.updateLine.selection) {
        throw new Error('No selection');
      }

      return response.data.updateLine.selection;
    },
    onMutate: async (line) => {
      window.CentraCheckout?.suspend();
      await queryClient.cancelQueries(selectionQuery);
      const previousSelection = queryClient.getQueryData(selectionQuery.queryKey);

      queryClient.setQueryData(selectionQuery.queryKey, (old) => {
        if (old) {
          return {
            ...old,
            lines: old.lines
              .filter((oldLine) => !!oldLine)
              .map((oldLine) => ({
                ...oldLine,
                quantity: oldLine.id === line.id ? line.quantity : oldLine.quantity,
              }))
              .filter((line) => line.quantity > 0),
          };
        }
      });

      return { previousSelection };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        queryClient.setQueryData(selectionQuery.queryKey, context.previousSelection);
      }
      void queryClient.invalidateQueries(selectionQuery);
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(checkoutQuery);
      queryClient.setQueryData(selectionQuery.queryKey, data);
    },
    onSettled: () => window.CentraCheckout?.resume(),
  });
};
