import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserError } from '@/lib/centra/errors';
import { mutationMutex } from '@/lib/centra/storefront-api/mutationLock';

import { addFlexibleBundleToCart } from './actions';
import { selectionQuery } from './queries';
import { addToCart, updateLine } from './service';

export const useAddFlexibleBundleToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['selection', 'addFlexibleBundleToCart'],
    mutationFn: async (variables: Parameters<typeof addFlexibleBundleToCart>[0]) => {
      const response = await mutationMutex.runExclusive(() => addFlexibleBundleToCart(variables));

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
