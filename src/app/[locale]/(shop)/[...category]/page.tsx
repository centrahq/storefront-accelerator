import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import { z } from 'zod';

import { Pagination } from '@/components/Pagination';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ProductCard, ProductCardSkeleton } from '@/features/product-listing/components/ProductCard';
import { ProductFilters, ProductFiltersSkeleton } from '@/features/product-listing/components/ProductFilters';
import { ProductGrid } from '@/features/product-listing/components/ProductGrid';
import {
  productsFilterParamsCache,
  serializeProductsFilters,
} from '@/features/product-listing/productListSearchParams';
import { TAGS } from '@/lib/centra/constants';
import { filterProducts, lookupCategory } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { FilterInput, ProductsQueryVariables, SortKey, SortOrder } from '@gql/graphql';

const ITEMS_PER_PAGE = 24;

type FetchProductsVariables = Omit<ProductsQueryVariables, 'filters'> & {
  category: number;
  filters: FilterInput[];
};

const fetchCategoryProductsCached = async (variables: FetchProductsVariables) => {
  'use cache';

  cacheTag(TAGS.products);
  cacheLife('hours');

  return fetchCategoryProductsUncached(variables);
};

const fetchCategoryProductsUncached = ({ category, filters, ...variables }: FetchProductsVariables) => {
  return filterProducts({
    ...variables,
    filters: [{ key: 'categories', values: [String(category)] }, ...filters],
  });
};

// Cache the results if we are fetching the first page with no filters.
const fetchCategoryProducts = async (variables: FetchProductsVariables) => {
  return variables.filters.length === 0 && variables.page === 1
    ? fetchCategoryProductsCached(variables)
    : fetchCategoryProductsUncached(variables);
};

const CategoryProducts = async ({ id, uri }: { id: number; uri: string }) => {
  const { brands, sizes, page, sort } = productsFilterParamsCache.all();

  const { market, pricelist, language } = await getSession();
  const [sortKey, sortOrder] = sort.split('-');
  const sortSchema = z.object({
    key: z.enum(SortKey),
    order: z.enum(SortOrder),
  });
  const { t } = await getTranslation(['server']);

  const { pagination, list, filters } = await fetchCategoryProducts({
    category: id,
    page,
    limit: ITEMS_PER_PAGE,
    market,
    pricelist,
    language,
    sort: sortSchema.safeParse({ key: sortKey, order: sortOrder }).data,
    filters: [
      ...(brands.length > 0 ? [{ key: 'brands', values: brands }] : []),
      ...(sizes.length > 0 ? [{ key: 'itemName', values: sizes }] : []),
    ],
  });

  const allFilters = productsFilterParamsCache.all();

  return (
    <>
      {filters && <ProductFilters filters={filters} />}
      {list && list.length > 0 ? (
        <ProductGrid>
          {list.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              imageSizes="(min-width: 1920px) 420px, (min-width: 1440px) 33vw, (min-width: 1024px) 50vw, 100vw"
              priority={index === 0}
              categoryUri={uri}
              prefetch
            />
          ))}
        </ProductGrid>
      ) : (
        <h2>{t('server:products.no-products-found')}</h2>
      )}
      {pagination.lastPage > 1 && (
        <div className="mx-auto">
          <Pagination
            page={pagination.currentPage}
            lastPage={pagination.lastPage}
            label={t('server:products.nav-label')}
            getPageHref={(page) => `/${uri}${serializeProductsFilters({ ...allFilters, page })}`}
          />
        </div>
      )}
    </>
  );
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string[] }>;
  searchParams: Promise<SearchParams>;
}) {
  await productsFilterParamsCache.parse(searchParams);
  const { market, language } = await getSession();

  const category = await lookupCategory({
    uri: (await params).category.join('/'),
    language,
    market,
  }).catch(() => notFound());

  return (
    <Suspense
      // Use the serialized filters as a key to ensure the fallback is shown when filters change.
      key={serializeProductsFilters(productsFilterParamsCache.all())}
      fallback={
        <>
          <ProductFiltersSkeleton />
          <ProductGrid>
            {Array.from(Array(ITEMS_PER_PAGE), (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </ProductGrid>
        </>
      }
    >
      <CategoryProducts id={category.id} uri={category.uri} />
    </Suspense>
  );
}
