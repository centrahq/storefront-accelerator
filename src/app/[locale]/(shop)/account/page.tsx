import { SearchParams } from 'nuqs';
import { Suspense } from 'react';

import { localeParam } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { OrdersSkeleton } from '@/features/order/components/OrdersSkeleton';
import { OrdersTable } from '@/features/order/components/OrdersTable';
import { orderFilterParamsCache, serializeOrderFilters } from '@/features/order/orderListSearchParams';

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  localeParam.parse((await params).locale);
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
