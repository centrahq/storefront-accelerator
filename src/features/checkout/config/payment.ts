const rawAddressForm = process.env.NEXT_PUBLIC_ADDRESS_FORM;
const addressForm: 'native' | 'stripe' = rawAddressForm === 'stripe' ? 'stripe' : 'native';

const expressCheckout = process.env.NEXT_PUBLIC_EXPRESS_CHECKOUT as 'stripe' | 'adyen' | undefined;

export const paymentConfig = {
  expressCheckout,
  addressForm,
} as const;

export const isProviderAddressForm = (): boolean => {
  return paymentConfig.addressForm === 'stripe';
};
