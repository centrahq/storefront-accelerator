import { SearchParams } from 'nuqs';
import { Suspense } from 'react';

import { getTranslation } from '@/features/i18n/useTranslation/server';
import { OrdersSkeleton } from '@/features/order/components/OrdersSkeleton';
import { OrdersTable } from '@/features/order/components/OrdersTable';
import { orderFilterParamsCache, serializeOrderFilters } from '@/features/order/orderListSearchParams';

export default async function AccountPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await orderFilterParamsCache.parse(searchParams);
  const { t } = await getTranslation(['server']);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-3xl font-medium">{t('server:user.my-orders')}</h2>
      <Suspense key={serializeOrderFilters(orderFilterParamsCache.all())} fallback={<OrdersSkeleton />}>
        <OrdersTable />
      </Suspense>
    </div>
  );
}
