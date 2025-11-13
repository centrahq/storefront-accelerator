import { UserError } from '@/lib/centra/errors';
import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { mutationMutex } from '@/lib/centra/storefront-api/mutationLock';
import { graphql } from '@gql/gql';
import { PaymentInstructionsInput } from '@gql/graphql';

/**
 * Fetches the current checkout state
 */
export async function fetchCheckout() {
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
}

/**
 * Fetches available payment methods and shipping methods for the current checkout
 */
export async function fetchCheckoutPaymentMethods() {
  const response = await centraFetch(
    graphql(`
      query checkoutPaymentMethods {
        selection {
          checkout {
            paymentMethods {
              uri
              kind
            }
            shippingMethods {
              id
            }
          }
        }
      }
    `),
  );

  return response.data.selection.checkout;
}

/**
 * Sets the shipping method for the current checkout
 * @param id - The shipping method ID to set
 */
export async function setShippingMethod(id: number) {
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
}

/**
 * Submits payment instructions to process the payment
 * @param variables - Payment instructions data (termsAndConditions will be automatically set to true)
 */
export async function submitPaymentInstructions(variables: Omit<PaymentInstructionsInput, 'termsAndConditions'>) {
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
}

