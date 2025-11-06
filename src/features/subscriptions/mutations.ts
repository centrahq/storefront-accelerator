import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserError } from '@/lib/centra/errors';
import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { mutationMutex } from '@/lib/centra/storefront-api/mutationLock';
import { graphql } from '@gql/gql';
import {
  ChangeSubscriptionContractAddressMutationVariables,
  UpdateSubscriptionIntervalMutationVariables,
  UpdateSubscriptionQuantityMutationVariables,
  UpdateSubscriptionStatusMutationVariables,
} from '@gql/graphql';

import { subscriptionsContractsQuery } from './queries';

export const useChangeSubscriptionContractAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['subscriptions', 'changeAddress'],
    mutationFn: async (variables: ChangeSubscriptionContractAddressMutationVariables) => {
      const response = await mutationMutex.runExclusive(() =>
        centraFetch(
          graphql(`
            mutation changeSubscriptionContractAddress($address: SubscriptionContractAddressInput!, $contractId: Int!) {
              changeSubscriptionContractAddress(address: $address, contractId: $contractId) {
                contract {
                  ...subscriptionContract
                }
                userErrors {
                  __typename
                  message
                  path
                }
              }
            }
          `),
          {
            variables,
          },
        ),
      );

      if (response.data.changeSubscriptionContractAddress.userErrors.length > 0) {
        throw new UserError(response.data.changeSubscriptionContractAddress.userErrors, response.extensions.traceId);
      }

      if (!response.data.changeSubscriptionContractAddress.contract) {
        throw new Error('No contract returned');
      }

      return response.data.changeSubscriptionContractAddress.contract;
    },
    onSuccess: (newContract) => {
      queryClient.setQueryData(subscriptionsContractsQuery.queryKey, (old) =>
        old?.map((contract) => (contract.id === newContract.id ? newContract : contract)),
      );
    },
  });
};

export const useUpdateSubscriptionInterval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['subscriptions', 'updateInterval'],
    mutationFn: async (variables: UpdateSubscriptionIntervalMutationVariables) => {
      const response = await mutationMutex.runExclusive(() =>
        centraFetch(
          graphql(`
            mutation updateSubscriptionInterval($subscriptionId: Int!, $subscriptionPlanId: Int!) {
              updateSubscriptionInterval(subscriptionId: $subscriptionId, subscriptionPlanId: $subscriptionPlanId) {
                contract {
                  ...subscriptionContract
                }
                userErrors {
                  __typename
                  message
                  path
                }
              }
            }
          `),
          {
            variables,
          },
        ),
      );

      if (response.data.updateSubscriptionInterval.userErrors.length > 0) {
        throw new UserError(response.data.updateSubscriptionInterval.userErrors, response.extensions.traceId);
      }

      if (!response.data.updateSubscriptionInterval.contract) {
        throw new Error('No contract returned');
      }

      return response.data.updateSubscriptionInterval.contract;
    },
    onSuccess: (newContract) => {
      queryClient.setQueryData(subscriptionsContractsQuery.queryKey, (old) =>
        old?.map((contract) => (contract.id === newContract.id ? newContract : contract)),
      );
    },
  });
};

export const useUpdateSubscriptionQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['subscriptions', 'updateQuantity'],
    mutationFn: async (variables: UpdateSubscriptionQuantityMutationVariables) => {
      const response = await mutationMutex.runExclusive(() =>
        centraFetch(
          graphql(`
            mutation updateSubscriptionQuantity($quantity: Int!, $subscriptionId: Int!) {
              updateSubscriptionQuantity(quantity: $quantity, subscriptionId: $subscriptionId) {
                contract {
                  ...subscriptionContract
                }
                userErrors {
                  __typename
                  message
                  path
                }
              }
            }
          `),
          {
            variables,
          },
        ),
      );

      if (response.data.updateSubscriptionQuantity.userErrors.length > 0) {
        throw new UserError(response.data.updateSubscriptionQuantity.userErrors, response.extensions.traceId);
      }

      if (!response.data.updateSubscriptionQuantity.contract) {
        throw new Error('No contract returned');
      }

      return response.data.updateSubscriptionQuantity.contract;
    },
    onSuccess: (newContract) => {
      queryClient.setQueryData(subscriptionsContractsQuery.queryKey, (old) =>
        old?.map((contract) => (contract.id === newContract.id ? newContract : contract)),
      );
    },
  });
};

export const useUpdateSubscriptionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['subscriptions', 'updateStatus'],
    mutationFn: async (variables: UpdateSubscriptionStatusMutationVariables) => {
      const response = await mutationMutex.runExclusive(() =>
        centraFetch(
          graphql(`
            mutation updateSubscriptionStatus($status: SubscriptionStatus!, $subscriptionId: Int!) {
              updateSubscriptionStatus(status: $status, subscriptionId: $subscriptionId) {
                contract {
                  ...subscriptionContract
                }
                userErrors {
                  __typename
                  message
                  path
                }
              }
            }
          `),
          {
            variables,
          },
        ),
      );

      if (response.data.updateSubscriptionStatus.userErrors.length > 0) {
        throw new UserError(response.data.updateSubscriptionStatus.userErrors, response.extensions.traceId);
      }

      if (!response.data.updateSubscriptionStatus.contract) {
        throw new Error('No contract returned');
      }

      return response.data.updateSubscriptionStatus.contract;
    },
    onSuccess: (newContract) => {
      queryClient.setQueryData(subscriptionsContractsQuery.queryKey, (old) =>
        old?.map((contract) => (contract.id === newContract.id ? newContract : contract)),
      );
    },
  });
};
