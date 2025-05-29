import { Metadata } from 'next';
import { Suspense } from 'react';

import { generateAlternates } from '@/features/i18n/metadata';
import { localeParam } from '@/features/i18n/routing/localeParam';
import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ProductGridSkeleton } from '@/features/product-listing/components/ProductGridSkeleton';
import { ProductList } from '@/features/product-listing/components/ProductList';
import { filterProducts } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { SortKey, SortOrder } from '@gql/graphql';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return {
    alternates: {
      canonical: `/${(await params).locale}`,
      languages: await generateAlternates('/'),
    },
    openGraph: {
      type: 'website',
    },
  };
}

const FeaturedItems = async () => {
  const { language, market, pricelist } = await getSession();

  const featuredItems = await filterProducts({
    page: 1,
    limit: 12,
    market,
    pricelist,
    language,
    filters: { key: 'collections', values: ['2'] },
    sort: {
      key: SortKey.ModifiedAt,
      order: SortOrder.Desc,
    },
    withFilters: false,
  }).then((res) => res.list ?? []);

  return <ProductList products={featuredItems} />;
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  localeParam.parse((await params).locale);

  const { t } = await getTranslation(['server']);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row items-baseline justify-between">
        <h1 className="text-3xl font-medium">{t('server:featured-products')}</h1>
        <ShopLink href="/products" className="text-mono-800 ml-auto font-semibold underline underline-offset-4">
          {t('server:view-all')}
        </ShopLink>
      </div>
      <Suspense fallback={<ProductGridSkeleton />}>
        <FeaturedItems />
      </Suspense>
    </div>
  );
}
