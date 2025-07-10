import { NextRequest, NextResponse } from 'next/server';

import { centraFetch } from '@/lib/centra/dtc-api/fetchers/session';
import { graphql } from '@gql/gql';
import { PaymentResultType } from '@gql/graphql';

/**
 * Resolves brackets in object keys (max 1 depth)
 *
 * @example
 * // returns { normalKey: 1, deep: { key: 2 } }
 * resolveBrackets({ 'normalKey': 1, 'deep[key]': 2 });
 */
const resolveBrackets = (input: Record<string, unknown>) => {
  return Object.entries(input).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const match = key.match(/^(?<mainKey>[^[\]]+)\[(?<innerKey>[^[\]]+)\]$/);
    const { mainKey, innerKey } = match?.groups ?? {};

    if (mainKey && innerKey) {
      acc[mainKey] ??= {};
      (acc[mainKey] as Record<string, unknown>)[innerKey] = value;
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});
};

const getPaymentResult = (fields: Record<string, unknown>) => {
  return centraFetch(
    graphql(`
      mutation paymentResult($paymentMethodFields: Map!) {
        paymentResult(paymentMethodFields: $paymentMethodFields) {
          type
          userErrors {
            message
            path
          }
        }
      }
    `),
    {
      variables: {
        paymentMethodFields: fields,
      },
    },
  )
    .then((response) => response.data.paymentResult.type)
    .catch(() => PaymentResultType.Failed);
};

/*
  The /success route handles the payment result from the payment provider. It must always be passed as `paymentReturnPage` to the `paymentInstructions` mutation.
  If the payment is successful, the route redirects to the /confirmation page; otherwise, it redirects to the /failed page.
*/
export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const paymentData = resolveBrackets(searchParams);
  const redirectTo = (await getPaymentResult(paymentData)) === PaymentResultType.Success ? '/confirmation' : '/failed';

  return NextResponse.redirect(new URL(redirectTo, request.url).toString());
}

export async function POST(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const body = Object.fromEntries((await request.formData()).entries());
  const paymentData = resolveBrackets({ ...searchParams, ...body });
  const redirectTo = (await getPaymentResult(paymentData)) === PaymentResultType.Success ? '/confirmation' : '/failed';

  return NextResponse.redirect(new URL(redirectTo, request.url).toString());
}
