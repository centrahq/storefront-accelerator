import { useMutation, useQueryClient } from '@tanstack/react-query';

import { sessionCookie } from '@/lib/centra/cookies';
import { UserError } from '@/lib/centra/errors';
import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { mutationMutex } from '@/lib/centra/storefront-api/mutationLock';
import { graphql } from '@gql/gql';
import {
  ApplyGiftCardMutationVariables,
  PaymentInstructionsInput,
  SetAddressMutationVariables,
  UpdateLineCheckoutMutationVariables,
} from '@gql/graphql';

import { checkoutQuery } from './queries';

export const useSetAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['checkout', 'setAddress'],
    mutationFn: async (variables: SetAddressMutationVariables) => {
      const response = await mutationMutex.runExclusive(() =>
        centraFetch(
          graphql(`
            mutation setAddress($billingAddress: AddressInput, $shippingAddress: AddressInput!) {
              setAddress(separateBillingAddress: $billingAddress, shippingAddress: $shippingAddress) {
                selection {
                  ...checkout
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

      if (response.data.setAddress.userErrors.length > 0) {
        throw new UserError(response.data.setAddress.userErrors, response.extensions.traceId);
      }

      if (!response.data.setAddress.selection?.checkout) {
        throw new Error('No selection');
      }

      return {
        ...response.data.setAddress.selection,
        checkout: response.data.setAddress.selection.checkout,
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(checkoutQuery.queryKey, data);
      // Reset the session cookie, in case it's affected by the address change
      document.cookie = `${sessionCookie.name}=;PATH=${sessionCookie.path};Max-Age=-99999999;`;
    },
  });
};

export const useSetShippingMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['checkout', 'setShippingMethod'],
    mutationFn: async (id: number) => {
      const response = await mutationMutex.runExclusive(() =>
        centraFetch(
          graphql(`
            mutation setShippingMethod($id: Int!) {
              setShippingMethod(id: $id) {
                selection {
                  ...checkout
                }
                userErrors {
                  message
                  path
                }
              }
            }
          `),
          {
            variables: {
              id,
            },
          },
        ),
      );

      if (response.data.setShippingMethod.userErrors.length > 0) {
        throw new UserError(response.data.setShippingMethod.userErrors, response.extensions.traceId);
      }

      if (!response.data.setShippingMethod.selection?.checkout) {
        throw new Error('Something went wrong');
      }

      return {
        ...response.data.setShippingMethod.selection,
        checkout: response.data.setShippingMethod.selection.checkout,
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(checkoutQuery.queryKey, data);
    },
  });
};

export const usePaymentInstructions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['checkout', 'startPayment'],
    mutationFn: async (variables: Omit<PaymentInstructionsInput, 'termsAndConditions'>) => {
      const response = await mutationMutex.runExclusive(() =>
        centraFetch(
          graphql(`
            mutation paymentInstructions($input: PaymentInstructionsInput!) {
              paymentInstructions(input: $input) {
                action {
                  ...paymentAction
                }
                selection {
                  ...checkout
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
            variables: {
              input: {
                ...variables,
                termsAndConditions: true,
              },
            },
          },
        ),
      );

      if (response.data.paymentInstructions.userErrors.length > 0) {
        throw new UserError(response.data.paymentInstructions.userErrors, response.extensions.traceId);
      }

      if (!response.data.paymentInstructions.selection.checkout) {
        throw new Error('No selection');
      }

      return {
        ...response.data.paymentInstructions,
        selection: {
          ...response.data.paymentInstructions.selection,
          checkout: response.data.paymentInstructions.selection.checkout,
        },
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(checkoutQuery.queryKey, data.selection);
    },
    onError: () => {
      void queryClient.invalidateQueries(checkoutQuery);
    },
  });
};

export const useSendWidgetData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['checkout', 'sendWidgetData'],
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await mutationMutex.runExclusive(() =>
        centraFetch(
          graphql(`
            mutation widgetEvent($payload: Map!) {
              handleWidgetEvent(payload: $payload) {
                selection {
                  ...checkout
                }
                userErrors {
                  message
                  path
                }
              }
            }
          `),
          {
            variables: {
              payload: data,
            },
          },
        ),
      );

      if (response.data.handleWidgetEvent.userErrors.length > 0) {
        throw new UserError(response.data.handleWidgetEvent.userErrors, response.extensions.traceId);
      }

      if (!response.data.handleWidgetEvent.selection?.checkout) {
        throw new Error('No selection');
      }

      return {
        ...response.data.handleWidgetEvent.selection,
        checkout: response.data.handleWidgetEvent.selection.checkout,
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(checkoutQuery.queryKey, data);
    },
  });
};

export const useAddVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['checkout', 'addVoucher'],
    mutationFn: async (code: string) => {
      const response = await mutationMutex.runExclusive(() => {
        window.CentraCheckout?.suspend();

        return centraFetch(
          graphql(`
            mutation addVoucher($code: String!) {
              addVoucher(code: $code) {
                selection {
                  ...checkout
                }
                userErrors {
                  message
                  path
                }
              }
            }
          `),
          {
            variables: {
              code,
            },
          },
        ).finally(() => {
          window.CentraCheckout?.resume();
        });
      });

      if (response.data.addVoucher.userErrors.length > 0) {
        throw new UserError(response.data.addVoucher.userErrors, response.extensions.traceId);
      }

      if (!response.data.addVoucher.selection?.checkout) {
        throw new Error('No selection');
      }

      return {
        ...response.data.addVoucher.selection,
        checkout: response.data.addVoucher.selection.checkout,
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(checkoutQuery.queryKey, data);
    },
  });
};

export const useRemoveVoucher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['checkout', 'removeVoucher'],
    mutationFn: async (code: string) => {
      const response = await mutationMutex.runExclusive(() => {
        window.CentraCheckout?.suspend();

        return centraFetch(
          graphql(`
            mutation removeVoucher($code: String!) {
              removeVoucher(code: $code) {
                selection {
                  ...checkout
                }
                userErrors {
                  message
                  path
                }
              }
            }
          `),
          {
            variables: {
              code,
            },
          },
        ).finally(() => {
          window.CentraCheckout?.resume();
        });
      });

      if (response.data.removeVoucher.userErrors.length > 0) {
        throw new UserError(response.data.removeVoucher.userErrors, response.extensions.traceId);
      }

      if (!response.data.removeVoucher.selection?.checkout) {
        throw new Error('No selection');
      }

      return {
        ...response.data.removeVoucher.selection,
        checkout: response.data.removeVoucher.selection.checkout,
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(checkoutQuery.queryKey, data);
    },
  });
};

export const useUpdateLineCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['checkout', 'updateLine'],
    mutationFn: async (variables: UpdateLineCheckoutMutationVariables) => {
      const response = await mutationMutex.runExclusive(() => {
        window.CentraCheckout?.suspend();

        return centraFetch(
          graphql(`
            mutation updateLineCheckout($id: String!, $quantity: Int!, $subscriptionPlanId: Int) {
              updateLine(lineId: $id, quantity: $quantity, subscriptionPlanId: $subscriptionPlanId) {
                userErrors {
                  message
                  path
                }
                selection {
                  ...checkout
                }
              }
            }
          `),
          {
            variables,
          },
        ).finally(() => {
          window.CentraCheckout?.resume();
        });
      });

      if (response.data.updateLine.userErrors.length > 0) {
        throw new UserError(response.data.updateLine.userErrors, response.extensions.traceId);
      }

      if (!response.data.updateLine.selection?.checkout) {
        throw new Error('No selection');
      }

      return {
        ...response.data.updateLine.selection,
        checkout: response.data.updateLine.selection.checkout,
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(checkoutQuery.queryKey, data);
    },
  });
};

export const useApplyGiftCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['checkout', 'applyGiftCard'],
    mutationFn: async (variables: ApplyGiftCardMutationVariables) => {
      const response = await mutationMutex.runExclusive(() => {
        window.CentraCheckout?.suspend();

        return centraFetch(
          graphql(`
            mutation applyGiftCard($cardNumber: String!, $pin: String) {
              applyGiftCard(input: { cardNumber: $cardNumber, pin: $pin }) {
                selection {
                  ...checkout
                }
                userErrors {
                  message
                  path
                }
              }
            }
          `),
          {
            variables,
          },
        ).finally(() => {
          window.CentraCheckout?.resume();
        });
      });

      if (response.data.applyGiftCard.userErrors.length > 0) {
        throw new UserError(response.data.applyGiftCard.userErrors, response.extensions.traceId);
      }

      if (!response.data.applyGiftCard.selection?.checkout) {
        throw new Error('No selection');
      }

      return {
        ...response.data.applyGiftCard.selection,
        checkout: response.data.applyGiftCard.selection.checkout,
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(checkoutQuery.queryKey, data);
    },
  });
};
