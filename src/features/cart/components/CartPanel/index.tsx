import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/lib/centra/storefront-api/queryClient';

import { selectionQuery } from '../../queries';
import { CartPanel } from './Panel';

interface Props {
  language: string;
  market: number;
}

export const Cart = async ({ language, market }: Props) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(selectionQuery);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CartPanel language={language} market={market} />
    </HydrationBoundary>
  );
};
