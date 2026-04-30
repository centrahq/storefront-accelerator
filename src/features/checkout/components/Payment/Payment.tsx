'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Trans } from '@/features/i18n';
import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { useTranslation } from '@/features/i18n/useTranslation/client';

import { paymentConfig } from '../../config/payment';
import { checkoutQuery } from '../../queries';
import { PaymentWidget } from './PaymentWidget';

export const Payment = () => {
  const { t } = useTranslation(['checkout']);
  const { data } = useSuspenseQuery(checkoutQuery);
  const method = paymentConfig.paymentMethod
    ? data.checkout.paymentMethods.find((m) => m.kind === paymentConfig.paymentMethod)
    : undefined;

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
      {method ? (
        <PaymentWidget id={method.id} uri={method.uri} kind={method.kind} />
      ) : (
        <p className="rounded border border-red-600 bg-red-50 p-4 text-sm text-red-800">
          {t('checkout:something-went-wrong')}
        </p>
      )}
    </div>
  );
};
