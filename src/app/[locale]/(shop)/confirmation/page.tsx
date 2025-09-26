import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { getTranslation } from '@/features/i18n/useTranslation/server';
import { OrderDetails } from '@/features/order/components/OrderDetails';
import { centraFetch } from '@/lib/centra/dtc-api/fetchers/session';
import { graphql } from '@gql/gql';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation(['server']);

  return {
    title: t('server:checkout.success'),
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function Confirmation() {
  // `order` query will always return the last order. This way, we can display last order details even after user refreshes the page.
  const receiptResponse = await centraFetch(
    graphql(`
      query receipt {
        order {
          ...order
        }
      }
    `),
  ).catch(notFound);

  const { order } = receiptResponse.data;

  if (!order) {
    redirect('/failed');
  }

  const { t } = await getTranslation(['server']);

  return (
    <div>
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <h1 className="text-4xl font-medium">{t('server:checkout.success')}</h1>
        <OrderDetails order={order} />
      </div>
    </div>
  );
}
