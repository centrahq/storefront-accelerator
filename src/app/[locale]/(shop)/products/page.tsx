import { type SearchParams } from 'nuqs/server';
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
import { filterProducts } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { SortKey, SortOrder } from '@gql/graphql';

const ITEMS_PER_PAGE = 24;

const Listing = async () => {
  const { q: query, brands, categories, sizes, page, sort } = productsFilterParamsCache.all();
  const allFilters = productsFilterParamsCache.all();
  const { market, pricelist, language } = await getSession();
  const { t } = await getTranslation(['server']);

  const [sortKey, sortOrder] = sort.split('-');
  const sortSchema = z.object({
    key: z.enum(SortKey),
    order: z.enum(SortOrder),
  });

  const { list, filters, pagination } = await filterProducts({
    page,
    limit: ITEMS_PER_PAGE,
    market,
    pricelist,
    language,
    search: query,
    sort: sortSchema.safeParse({ key: sortKey, order: sortOrder }).data,
    filters: [
      ...(brands.length > 0 ? [{ key: 'brands', values: brands }] : []),
      ...(categories.length > 0 ? [{ key: 'categories', values: categories }] : []),
      ...(sizes.length > 0 ? [{ key: 'itemName', values: sizes }] : []),
    ],
  });

  return (
    <>
      {filters && <ProductFilters filters={filters} />}
      {list && list.length > 0 ? (
        <ProductGrid>
          {list.map((product) => (
            <ProductCard
              key={product.id}
              imageSizes="(min-width: 1920px) 420px, (min-width: 1440px) 33vw, (min-width: 1024px) 50vw, 100vw"
              product={product}
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
            getPageHref={(page) => `/products${serializeProductsFilters({ ...allFilters, page })}`}
          />
        </div>
      )}
    </>
  );
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await productsFilterParamsCache.parse(searchParams);

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
      <Listing />
    </Suspense>
  );
}
