'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { isProviderAddressForm } from '../../config/payment';
import { checkoutQuery } from '../../queries';
import { NativeAddressForm } from './NativeAddressForm';
import { StripeAddressForm } from './StripeAddressForm';

interface AddressProps {
  countries: Array<{
    code: string;
    name: string;
    states?: Array<{
      name: string;
      code: string;
    }>;
  }>;
  language: string;
  market: number;
}

export const AddressForm = ({ countries, language, market }: AddressProps) => {
  const { data } = useSuspenseQuery(checkoutQuery);

  if (isProviderAddressForm()) {
    return <StripeAddressForm language={language} market={market} />;
  }

  return (
    <NativeAddressForm
      key={JSON.stringify([data.checkout.shippingAddress, data.checkout.separateBillingAddress])}
      countries={countries}
    />
  );
};
