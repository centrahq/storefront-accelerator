'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { PaymentMethodKind } from '@gql/graphql';

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

  const hasStripePaymentMethod = data.checkout.paymentMethods.some(
    (m) => m.kind === PaymentMethodKind.StripePaymentIntents,
  );

  if (isProviderAddressForm() && hasStripePaymentMethod) {
    return <StripeAddressForm language={language} market={market} />;
  }

  return <NativeAddressForm countries={countries} />;
};
