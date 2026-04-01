'use client';

import { PaymentMethodKind } from '@gql/graphql';

import { ScriptPaymentWidget } from './ScriptPaymentWidget';
import { StripePaymentIntentsWidget } from './StripePaymentIntentsWidget';

interface Props {
  id: number;
  uri: string;
  kind: PaymentMethodKind;
}

export const PaymentWidget = ({ id, uri, kind }: Props) => {
  if (kind === PaymentMethodKind.StripePaymentIntents) {
    return <StripePaymentIntentsWidget id={id} />;
  }

  return <ScriptPaymentWidget id={id} uri={uri} />;
};
