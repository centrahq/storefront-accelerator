import { Metadata } from 'next';
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

import { generateAlternates } from '@/features/i18n/metadata';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ProductCard } from '@/features/product-listing/components/ProductCard';
import { ProductGrid } from '@/features/product-listing/components/ProductGrid';
import { TAGS } from '@/lib/centra/constants';
import { filterProducts } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { ProductsQueryVariables, SortKey, SortOrder } from '@gql/graphql';

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

/*
  We use a collection to represent featured products.
  You could also use a CMS or a product discovery platform to manage the products shown on the homepage.
*/
const getFeaturedProducts = async ({
  market,
  language,
  pricelist,
}: Pick<ProductsQueryVariables, 'market' | 'language' | 'pricelist'>) => {
  'use cache';

  cacheTag(TAGS.products);
  cacheLife('hours');

  return await filterProducts({
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
  });
};

export default async function Home() {
  const { t } = await getTranslation(['server']);
  const session = await getSession();
  const featuredProducts = await getFeaturedProducts(session).then((res) => res.list ?? []);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-medium">{t('server:featured-products')}</h1>
      <ProductGrid>
        {featuredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            imageSizes="(min-width: 1920px) 420px, (min-width: 1440px) 33vw, (min-width: 1024px) 50vw, 100vw"
            priority={index === 0}
            prefetch
          />
        ))}
      </ProductGrid>
    </div>
  );
}
