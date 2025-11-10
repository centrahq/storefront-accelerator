import { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';

import { Hero, MoreSection, Newsletter, SocialProof } from '@/components/CMSContent';
import { generateAlternates } from '@/features/i18n/metadata';
import { ProductCard } from '@/features/product-listing/components/ProductCard';
import { ProductGrid } from '@/features/product-listing/components/ProductGrid';
import { TAGS } from '@/lib/centra/constants';
import { getSession } from '@/lib/centra/sessionCookie';
import { filterProducts } from '@/lib/centra/storefront-api/fetchers/noSession';
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
  We use a collection to represent newest products.
  You could also use a CMS or a product discovery platform to manage the products shown on the homepage.
*/
const getNewestProducts = async ({
  market,
  language,
  pricelist,
}: Pick<ProductsQueryVariables, 'market' | 'language' | 'pricelist'>) => {
  'use cache: remote';

  cacheTag(TAGS.products);
  cacheLife('hours');

  return await filterProducts({
    page: 1,
    limit: 12,
    market,
    pricelist,
    language,
    where: { filters: [{ key: 'collections', values: ['2'] }] },
    sort: {
      key: SortKey.ModifiedAt,
      order: SortOrder.Desc,
    },
    withFilters: false,
  });
};

/*
  We use a collection to represent special offers.
  You could also use a CMS or a product discovery platform to manage the products shown on the homepage.
*/
const getSpecialOffers = async ({
  market,
  language,
  pricelist,
}: Pick<ProductsQueryVariables, 'market' | 'language' | 'pricelist'>) => {
  'use cache: remote';

  cacheTag(TAGS.products);
  cacheLife('hours');

  return await filterProducts({
    page: 1,
    limit: 12,
    market,
    pricelist,
    language,
    where: { filters: [{ key: 'collections', values: ['11'] }] },
    sort: {
      key: SortKey.ModifiedAt,
      order: SortOrder.Desc,
    },
    withFilters: false,
  });
};

export default async function Home() {
  const session = await getSession();
  const [newestProducts, specialOffers] = await Promise.all([
    getNewestProducts(session).then((res) => res.list ?? []),
    getSpecialOffers(session).then((res) => res.list ?? []),
  ]);

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <Hero />
      <SocialProof />
      <h2 className="text-3xl font-medium">Newest collection</h2>
      <ProductGrid>
        {newestProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            imageSizes="(min-width: 1920px) 420px, (min-width: 1440px) 33vw, (min-width: 1024px) 50vw, 100vw"
            prefetch
          />
        ))}
      </ProductGrid>
      <Newsletter />
      <h2 className="text-3xl font-medium">Special offers</h2>
      <ProductGrid>
        {specialOffers.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            imageSizes="(min-width: 1920px) 420px, (min-width: 1440px) 33vw, (min-width: 1024px) 50vw, 100vw"
            prefetch
          />
        ))}
      </ProductGrid>
      <MoreSection />
    </div>
  );
}
