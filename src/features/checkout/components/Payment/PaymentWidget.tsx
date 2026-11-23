'use client';

import { PaymentMethodKind } from '@gql/graphql';

import { AdyenDropinWidget } from './AdyenDropinWidget';
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

  if (kind === PaymentMethodKind.AdyenDropin) {
    return <AdyenDropinWidget id={id} />;
  }

  return <ScriptPaymentWidget id={id} uri={uri} />;
};
