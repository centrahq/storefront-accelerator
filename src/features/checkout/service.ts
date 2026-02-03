import { UserError } from '@/lib/centra/errors';
import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { mutationMutex } from '@/lib/centra/storefront-api/mutationLock';
import { graphql } from '@gql/gql';
import type { CheckoutFragment, PaymentInstructionsInput } from '@gql/graphql';

export type CheckoutSelection = CheckoutFragment & {
  checkout: NonNullable<CheckoutFragment['checkout']>;
};

export async function fetchCheckout(expressCheckout = false): Promise<CheckoutSelection> {
  return initializeCheckoutWithExpress(expressCheckout);
}

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

export async function setShippingMethod(id: number): Promise<CheckoutSelection> {
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

export async function sendWidgetData(payload: Record<string, unknown>): Promise<CheckoutSelection> {
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
          payload,
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
}

export async function initializeCheckoutWithExpress(expressCheckout: boolean): Promise<CheckoutSelection> {
  const response = await mutationMutex.runExclusive(() =>
    centraFetch(
      graphql(`
        mutation InitializeCheckoutWithExpress($payload: Map!) {
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
          payload: {
            expressCheckout,
          },
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
}
