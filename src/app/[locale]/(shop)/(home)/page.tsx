import { Metadata } from 'next';

import { generateAlternates } from '@/features/i18n/metadata';
import { localeParam } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ProductCard } from '@/features/product-listing/components/ProductCard';
import { ProductGrid } from '@/features/product-listing/components/ProductGrid';
import { filterProducts } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { SortKey, SortOrder } from '@gql/graphql';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return {
    alternates: {
      canonical: `/${(await params).locale}`,
      languages: {
        ...(await generateAlternates('/')),
        'x-default': '/',
      },
    },
    openGraph: {
      type: 'website',
    },
  };
}

const FeaturedItems = async () => {
  const { language } = localeParam;
  const { market, pricelist } = await getSession();

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

  return (
    <ProductGrid>
      {featuredItems.map((product) => (
        <ProductCard key={product.id} product={product} prefetch />
      ))}
    </ProductGrid>
  );
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  localeParam.parse((await params).locale);

  const { t } = await getTranslation(['server']);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-medium">{t('server:featured-products')}</h1>
      <FeaturedItems />
    </div>
  );
}
