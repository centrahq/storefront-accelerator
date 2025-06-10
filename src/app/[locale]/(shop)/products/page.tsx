import { Metadata } from 'next';
import { type SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import { z } from 'zod';

import { Pagination } from '@/components/Pagination';
import { localeParam } from '@/features/i18n/routing/localeParam';
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

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
};

const Listing = async ({ searchParams }: { searchParams: PageProps['searchParams'] }) => {
  const { q: query, brands, categories, sizes, page, sort } = await productsFilterParamsCache.parse(searchParams);
  const allFilters = productsFilterParamsCache.all();
  const { market, pricelist, language } = await getSession();
  const { t } = await getTranslation(['server']);

  const [sortKey, sortOrder] = sort.split('-');
  const sortSchema = z.object({
    key: z.nativeEnum(SortKey),
    order: z.nativeEnum(SortOrder),
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
            <ProductCard key={product.id} product={product} />
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

export default async function ProductsPage({ searchParams, params }: PageProps) {
  localeParam.parse((await params).locale);
  await productsFilterParamsCache.parse(searchParams);

  return (
    <Suspense
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
      <Listing searchParams={searchParams} />
    </Suspense>
  );
}
