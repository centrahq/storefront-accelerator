'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { checkoutQuery } from '../queries';
import { CheckoutItems } from './CheckoutItems';
import { ExpressCheckout } from './Payment/ExpressCheckout';
import { Totals } from './Totals/Totals';

interface Props {
  language: string;
  market: number;
  summary: string;
}

export const CheckoutSummary = ({ language, market, summary }: Props) => {
  const { t } = useTranslation(['checkout']);
  const { data } = useSuspenseQuery(checkoutQuery);
  const { lines, checkout } = data;

  const hasSubscriptionItems = lines.some((line) => line?.subscriptionId != null);
  const cartTotal = checkout.totals.find((total) => total.type === 'GRAND_TOTAL')?.price.value ?? 0;
  const lineItems = lines
    .filter((line): line is NonNullable<typeof line> => line !== null)
    .map((line) => ({
      name: line.displayItem.name,
      price: line.lineValue.value.toFixed(2),
    }));

  return (
    <div className="sticky top-20 mx-auto flex w-100 flex-col gap-8 lg:mx-0">
      <div>
        <h2 className="text-3xl font-medium">{summary}</h2>
        <p className="text-mono-500">{t('checkout:cart.hint')}</p>
      </div>
      <CheckoutItems lines={lines} />
      <Totals />
      {!hasSubscriptionItems && lineItems.length > 0 && (
        <ExpressCheckout
          cartTotal={cartTotal}
          initialLineItems={lineItems}
          language={language}
          market={market}
        />
      )}
    </div>
  );
};
