import { createSearchParamsCache, createSerializer, parseAsInteger } from 'nuqs/server';

const orderFilterParsers = {
  ordersPage: parseAsInteger.withDefault(1),
};

export const orderFilterParamsCache = createSearchParamsCache(orderFilterParsers);
export const serializeOrderFilters = createSerializer(orderFilterParsers);
