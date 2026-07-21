import { UserError } from '@/lib/centra/errors';
import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { mutationMutex } from '@/lib/centra/storefront-api/mutationLock';
import { graphql } from '@gql/gql';
import { PaymentInstructionsInput, PaymentInstructionsMutation, WidgetEventMutation } from '@gql/graphql';

type RawWidgetEventSelection = NonNullable<WidgetEventMutation['handleWidgetEvent']['selection']>;
export type CheckoutData = Omit<RawWidgetEventSelection, 'checkout'> & {
  checkout: NonNullable<RawWidgetEventSelection['checkout']>;
};

export type PaymentInstructionsData = Omit<PaymentInstructionsMutation['paymentInstructions'], 'selection'> & {
  selection: CheckoutData;
};

// The widget event requires an `expressCheckout` flag so the backend returns
// the correct payment methods (express-only vs full checkout).
// `fetchCheckout` is the default for the standard checkout flow.
export function fetchCheckout(): Promise<CheckoutData> {
  return sendWidgetData({ expressCheckout: false });
}

// Used by the Stripe/Adyen express checkout components (Apple Pay, Google Pay)
// to fetch payment methods scoped to express wallets only.
export function fetchExpressCheckout(): Promise<CheckoutData> {
  return sendWidgetData({ expressCheckout: true });
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

export async function submitPaymentInstructions(
  variables: Omit<PaymentInstructionsInput, 'termsAndConditions'>,
): Promise<PaymentInstructionsData> {
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

export async function sendWidgetData(payload: Record<string, unknown>): Promise<CheckoutData> {
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
