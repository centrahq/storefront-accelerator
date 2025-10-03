import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

export const productsFilterParsers = {
  q: parseAsString.withDefault(''),
  brands: parseAsArrayOf(parseAsString).withDefault([]),
  categories: parseAsArrayOf(parseAsString).withDefault([]),
  collections: parseAsArrayOf(parseAsString).withDefault([]),
  sizes: parseAsArrayOf(parseAsString).withDefault([]),
  sort: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  onlyAvailable: parseAsBoolean.withDefault(false),
};

export const productsFilterParamsCache = createSearchParamsCache(productsFilterParsers);
export const serializeProductsFilters = createSerializer(productsFilterParsers);
