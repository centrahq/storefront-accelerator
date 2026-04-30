import { PaymentMethodKind } from '@gql/graphql';

const rawAddressForm = process.env.NEXT_PUBLIC_ADDRESS_FORM;
const addressForm: 'native' | 'stripe' = rawAddressForm === 'stripe' ? 'stripe' : 'native';

const paymentMethod = process.env.NEXT_PUBLIC_PAYMENT_METHOD as PaymentMethodKind | undefined;

export const paymentConfig = {
  paymentMethod,
  expressCheckout: process.env.NEXT_PUBLIC_EXPRESS_CHECKOUT === 'true',
  addressForm,
} as const;

export const isProviderAddressForm = (): boolean => {
  if (paymentConfig.addressForm === 'stripe') {
    return paymentConfig.paymentMethod === PaymentMethodKind.StripePaymentIntents;
  }
  return false;
};

if (paymentConfig.addressForm !== 'native' && !isProviderAddressForm()) {
  console.warn(
    `[paymentConfig] addressForm="${paymentConfig.addressForm}" requires a matching NEXT_PUBLIC_PAYMENT_METHOD ` +
      `(stripe → ${PaymentMethodKind.StripePaymentIntents}). ` +
      `Selected method "${paymentMethod ?? 'undefined'}" does not match — falling back to native.`,
  );
}
