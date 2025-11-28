import { UserError } from '@/lib/centra/errors';
import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { mutationMutex } from '@/lib/centra/storefront-api/mutationLock';
import { graphql } from '@gql/gql';
import { AddItemMutationVariables, UpdateLineMutationVariables } from '@gql/graphql';

export async function updateLine(variables: UpdateLineMutationVariables) {
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
}

export async function addToCart(variables: AddItemMutationVariables) {
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
}

