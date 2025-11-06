'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Trans } from '@/features/i18n';
import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { PaymentMethodKind } from '@gql/graphql';

import { checkoutQuery } from '../../queries';
import { PaymentWidget } from './PaymentWidget';

const PAYMENT_METHODS = [PaymentMethodKind.AdyenDropin, PaymentMethodKind.KlarnaPayments];

export const Payment = () => {
  const { t } = useTranslation(['checkout']);
  const { data } = useSuspenseQuery(checkoutQuery);

  const paymentMethods = PAYMENT_METHODS.map((method) =>
    data.checkout.paymentMethods.find((m) => m.kind === method),
  ).filter((method) => !!method);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(paymentMethods[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-medium">{t('checkout:payment')}</h2>
        <p className="text-mono-500 text-sm">{t('checkout:secure-transactions')}</p>
        <p className="text-mono-500 text-sm">
          <Trans t={t} i18nKey="checkout:terms">
            By placing your order, you agree to our
            <ShopLink href="/terms" target="_blank" className="underline underline-offset-2">
              Terms and Conditions
            </ShopLink>
          </Trans>
        </p>
      </div>
      {paymentMethods.length === 1 && paymentMethods[0] && (
        <PaymentWidget id={paymentMethods[0].id} uri={paymentMethods[0].uri} />
      )}
      {paymentMethods.length > 1 && (
        <div className="flex flex-col gap-4">
          {paymentMethods.map((method, index) => (
            <div key={method.id} className="border-mono-500 flex flex-col gap-4 rounded-md border p-4">
              <button
                type="button"
                className="flex items-center justify-between"
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                {index === 0 ? t('checkout:payment-options') : method.name}
                {selectedPaymentMethod === method.id ? (
                  <ChevronUpIcon className="text-mono-800 size-4" aria-hidden="true" />
                ) : (
                  <ChevronDownIcon className="text-mono-800 size-4" aria-hidden="true" />
                )}
              </button>
              {selectedPaymentMethod === method.id && <PaymentWidget id={method.id} uri={method.uri} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
