import { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import { z } from 'zod';

import { Pagination } from '@/components/Pagination';
import { generateAlternates } from '@/features/i18n/metadata';
import { localeParam } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ProductFilters } from '@/features/product-listing/components/ProductFilters';
import { ProductList } from '@/features/product-listing/components/ProductList';
import { ProductListSkeleton } from '@/features/product-listing/components/ProductListSkeleton';
import {
  productsFilterParamsCache,
  serializeProductsFilters,
} from '@/features/product-listing/productListSearchParams';
import { filterProducts, getCategoryDetails } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { SortKey, SortOrder } from '@gql/graphql';

const categoryHandleRegex = /^(?<uri>[^.]*).(?<id>\d+)$/;
const ITEMS_PER_PAGE = 24;

interface PageProps {
  params: Promise<{ locale: string; category: string[] }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata(props: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params;
  const { language } = localeParam.parse(params.locale);

  const id = params.category.at(-1)?.match(categoryHandleRegex)?.groups?.id;

  if (!id) {
    return notFound();
  }

  const category = await getCategoryDetails({ id: Number(id) });
  const translations = category?.translations.find((translation) => translation.language.code === language);

  if (!category || !translations) {
    return notFound();
  }

  return {
    title: translations.metaTitle || translations.name?.join(' | '),
    description: translations.metaDescription || (await parent).description,
    alternates: {
      canonical: `/${params.locale}/category/${translations.uri}.${category.id}`,
      languages: await generateAlternates(
        (lang) =>
          `/category/${category.translations.find(({ language }) => language.code === lang)?.uri ?? translations.uri}.${id}`,
      ),
    },
  };
}

const Listing = async ({
  id,
  uri,
  searchParams,
}: {
  id: number;
  uri: string;
  searchParams: PageProps['searchParams'];
}) => {
  const { brands, sizes, page, sort } = await productsFilterParamsCache.parse(searchParams);

  const { market, pricelist, language } = await getSession();
  const [sortKey, sortOrder] = sort.split('-');
  const sortSchema = z.object({
    key: z.nativeEnum(SortKey),
    order: z.nativeEnum(SortOrder),
  });
  const { t } = await getTranslation(['server']);

  const { pagination, list, filters } = await filterProducts({
    page,
    limit: ITEMS_PER_PAGE,
    market,
    pricelist,
    language,
    sort: sortSchema.safeParse({ key: sortKey, order: sortOrder }).data,
    filters: [
      { key: 'categories', values: [String(id)] },
      ...(brands.length > 0 ? [{ key: 'brands', values: brands }] : []),
      ...(sizes.length > 0 ? [{ key: 'itemName', values: sizes }] : []),
    ],
  });

  const allFilters = productsFilterParamsCache.all();

  return (
    <>
      {filters && <ProductFilters filters={filters} />}
      {list && list.length > 0 ? <ProductList products={list} /> : <h2>{t('server:products.no-products-found')}</h2>}
      {pagination.lastPage > 1 && (
        <div className="mx-auto">
          <Pagination
            page={pagination.currentPage}
            lastPage={pagination.lastPage}
            label={t('server:products.nav-label')}
            getPageHref={(page) => `/category/${uri}.${id}${serializeProductsFilters({ ...allFilters, page })}`}
          />
        </div>
      )}
    </>
  );
};

export default async function CategoryListingPage(props: PageProps) {
  const params = await props.params;
  const { language } = localeParam.parse(params.locale);

  const id = params.category.at(-1)?.match(categoryHandleRegex)?.groups?.id;

  if (!id) {
    return notFound();
  }

  const category = await getCategoryDetails({ id: Number(id) });
  const translations = category?.translations.find((translation) => translation.language.code === language);

  if (!category || !translations) {
    return notFound();
  }

  if (params.category.join('/') !== `${translations.uri}.${category.id}`) {
    return redirect(`/category/${translations.uri}.${category.id}`);
  }

  const { t } = await getTranslation(['server']);

  return (
    <div className="flex flex-col gap-6 sm:gap-10">
      <title>{t('server:products.title')}</title>
      <h1 className="text-4xl font-medium">{translations.name?.at(-1)}</h1>
      <Suspense fallback={<ProductListSkeleton />}>
        <Listing id={category.id} uri={translations.uri} searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
