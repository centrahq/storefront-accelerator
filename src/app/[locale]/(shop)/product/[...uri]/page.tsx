import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Product, WithContext } from 'schema-dts';

import { ProductReviews, SocialProof } from '@/components/CMSContent';
import { generateAlternates } from '@/features/i18n/metadata';
import { Bundle } from '@/features/product-details/bundle/components/Bundle';
import { Items } from '@/features/product-details/components/Items';
import { ProductMedia } from '@/features/product-details/components/ProductMedia';
import { RelatedProducts, RelatedProductsSkeleton } from '@/features/product-details/components/RelatedProducts';
import { Variants } from '@/features/product-details/components/Variants';
import { ProductAccordion } from '@/features/product-listing/components/ProductAccordion';
import { ProductBreadcrumbs } from '@/features/product-listing/components/ProductBreadcrumbs';
import { ProductDescription } from '@/features/product-listing/components/ProductDescription/ProductDescription';
import { lookupProduct } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { BundlePriceType, BundleType } from '@gql/graphql';

interface PageProps {
  params: Promise<{
    locale: string;
    uri: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { locale, uri } = await params;
  const { market, language, pricelist } = await getSession();

  const product = await lookupProduct({
    uri: uri.join('/'),
    language,
    market,
    pricelist,
  }).catch(() => notFound());

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || (await parent).description,
    alternates: {
      canonical: `/${locale}/product/${product.uri}`,
      languages: await generateAlternates(
        (lang) => `/product/${product.translations.find(({ language }) => language.code === lang)?.uri ?? product.uri}`,
      ),
    },
    openGraph: {
      images:
        product.media.length > 0
          ? product.media.map((medium) => ({
              url: medium.source.url,
              alt: product.name,
            }))
          : (await parent).openGraph?.images,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { uri } = await params;
  const { market, pricelist, language } = await getSession();

  const product = await lookupProduct({
    uri: uri.join('/'),
    language,
    market,
    pricelist,
  }).catch(() => notFound());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': product.metaTitle || product.name,
            'description': product.metaDescription,
            'image': product.media[0]?.source.url,
            'offers': {
              '@type': 'Offer',
              'availability': product.available ? 'InStock' : 'OutOfStock',
              'priceCurrency': product.price?.currency.code,
              'price': product.price?.value,
            },
          } satisfies WithContext<Product>),
        }}
      />
      <div className="flex flex-col gap-8 lg:gap-10">
        <div className="grid grid-cols-1 justify-between gap-3 md:grid-cols-[minmax(13rem,53rem)_minmax(22rem,43rem)] md:gap-10 lg:gap-20">
          <ProductMedia media={product.media} />
          <div className="flex flex-col gap-3 md:gap-5 md:only:col-span-2">
            {product.category && (
              <ProductBreadcrumbs category={product.category} productName={product.name} productUri={uri.join('/')} />
            )}
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <h1 className="text-4xl font-medium">{product.name}</h1>
              <ProductReviews />
            </div>
            <div className="text-3xl font-medium">
              {product.bundle?.type === BundleType.Flexible && product.bundle.priceType === BundlePriceType.Dynamic ? (
                <>
                  <span>{product.bundle.minPrice?.formattedValue}</span>
                  <span> - </span>
                  <span>{product.bundle.maxPrice?.formattedValue}</span>
                </>
              ) : (
                product.price?.formattedValue
              )}
            </div>
            {product.shortDescription.formatted && (
              <ProductDescription description={product.shortDescription.formatted} />
            )}
            <Variants product={product} />
            <Bundle product={product} />
            <Items product={product} />
            <ProductAccordion product={product} />
          </div>
        </div>
        <SocialProof />
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts id={product.id} />
        </Suspense>
      </div>
    </>
  );
}
