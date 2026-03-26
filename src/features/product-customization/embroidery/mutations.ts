import { useMutation, useQueryClient } from '@tanstack/react-query';

import { selectionQuery } from '@/features/cart/queries';
import { checkoutQuery } from '@/features/checkout/queries';
import { UserError } from '@/lib/centra/errors';
import { mutationMutex } from '@/lib/centra/storefront-api/mutationLock';

import { addEmbroideryToLine, removeEmbroideryFromLine } from './actions';

export const useAddEmbroideryToLine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['selection', 'addEmbroideryToLine'],
    mutationFn: async (variables: Parameters<typeof addEmbroideryToLine>[0]) => {
      const response = await mutationMutex.runExclusive(() => addEmbroideryToLine(variables));

      if (response.data.setLineAttributes.userErrors.length > 0) {
        throw new UserError(response.data.setLineAttributes.userErrors, response.extensions.traceId);
      }

      if (!response.data.setLineAttributes.selection) {
        throw new Error('No selection');
      }

      return response.data.setLineAttributes.selection;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(selectionQuery.queryKey, data);
    },
  });
};

export const useAddEmbroideryCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['checkout', 'addEmbroideryToLine'],
    mutationFn: async (variables: Parameters<typeof addEmbroideryToLine>[0]) => {
      const response = await mutationMutex.runExclusive(() => {
        window.CentraCheckout?.suspend();

        return addEmbroideryToLine(variables, true).finally(() => {
          window.CentraCheckout?.resume();
        });
      });

      if (response.data.setLineAttributes.userErrors.length > 0) {
        throw new UserError(response.data.setLineAttributes.userErrors, response.extensions.traceId);
      }

      if (!response.data.setLineAttributes.selection?.checkout) {
        throw new Error('No selection');
      }

      return {
        ...response.data.setLineAttributes.selection,
        checkout: response.data.setLineAttributes.selection.checkout,
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(checkoutQuery.queryKey, data);
    },
  });
};

export const useRemoveEmbroideryFromLine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['selection', 'removeEmbroideryFromLine'],
    mutationFn: async (variables: Parameters<typeof removeEmbroideryFromLine>[0]) => {
      const response = await mutationMutex.runExclusive(() => removeEmbroideryFromLine(variables));

      if (response.data.unsetLineAttributes.userErrors.length > 0) {
        throw new UserError(response.data.unsetLineAttributes.userErrors, response.extensions.traceId);
      }

      if (!response.data.unsetLineAttributes.selection) {
        throw new Error('No selection');
      }

      return response.data.unsetLineAttributes.selection;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(selectionQuery.queryKey, data);
    },
  });
};

export const useRemoveEmbroideryCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['checkout', 'removeEmbroideryFromLine'],
    mutationFn: async (variables: Parameters<typeof removeEmbroideryFromLine>[0]) => {
      const response = await mutationMutex.runExclusive(() => {
        window.CentraCheckout?.suspend();

        return removeEmbroideryFromLine(variables, true).finally(() => {
          window.CentraCheckout?.resume();
        });
      });

      if (response.data.unsetLineAttributes.userErrors.length > 0) {
        throw new UserError(response.data.unsetLineAttributes.userErrors, response.extensions.traceId);
      }

      if (!response.data.unsetLineAttributes.selection?.checkout) {
        throw new Error('No selection');
      }

      return {
        ...response.data.unsetLineAttributes.selection,
        checkout: response.data.unsetLineAttributes.selection.checkout,
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(checkoutQuery.queryKey, data);
    },
  });
};
