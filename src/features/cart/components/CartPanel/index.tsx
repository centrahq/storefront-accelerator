import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { connection } from 'next/server';

import { getQueryClient } from '@/lib/centra/dtc-api/queryClient';

import { selectionQuery } from '../../queries';
import { CartPanel } from './Panel';

export const Cart = async () => {
  await connection(); // Don't call session api during build
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(selectionQuery);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CartPanel />
    </HydrationBoundary>
  );
};
