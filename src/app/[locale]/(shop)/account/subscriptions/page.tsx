import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import { Suspense } from 'react';

import { getTranslation } from '@/features/i18n/useTranslation/server';
import { SubscriptionContractsTable } from '@/features/subscriptions/components/SubscriptionContractsTable';
import { SubscriptionsSkeleton } from '@/features/subscriptions/components/SubscriptionsSkeleton';
import { subscriptionsContractsQuery } from '@/features/subscriptions/queries';
import { getQueryClient } from '@/lib/centra/storefront-api/queryClient';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation(['server']);

  return {
    title: t('server:user.my-subscriptions'),
  };
}

const Subscriptions = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(subscriptionsContractsQuery);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubscriptionContractsTable />
    </HydrationBoundary>
  );
};

export default async function SubscriptionsPage() {
  const { t } = await getTranslation(['server']);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-3xl font-medium">{t('server:user.my-subscriptions')}</h2>
      <Suspense fallback={<SubscriptionsSkeleton />}>
        <Subscriptions />
      </Suspense>
    </div>
  );
}
