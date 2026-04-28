import { PaymentMethodKind } from '@gql/graphql';

export const paymentConfig = {
  paymentMethod: process.env.NEXT_PUBLIC_PAYMENT_METHOD as PaymentMethodKind | undefined,
  stripeUseAddressElement: process.env.NEXT_PUBLIC_STRIPE_USE_ADDRESS_ELEMENT === 'true',
} as const;
