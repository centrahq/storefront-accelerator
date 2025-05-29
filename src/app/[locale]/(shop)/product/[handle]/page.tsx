import { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

import { WithSession } from '@/components/WithSession';
import { generateAlternates } from '@/features/i18n/metadata';
import { localeParam } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { Bundle } from '@/features/product-details/bundle/components/Bundle';
import { Items } from '@/features/product-details/components/Items';
import { ItemSelectorSkeleton } from '@/features/product-details/components/ItemSelectorSkeleton';
import { JsonLD } from '@/features/product-details/components/JsonLd';
import { ProductMedia } from '@/features/product-details/components/ProductMedia';
import { ProductDescription } from '@/features/product-listing/components/ProductDescription/ProductDescription';
import { getProductDetails } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getItemName, getPriceByMarketPricelist } from '@/lib/utils/product';
import { BundlePriceType, BundleType } from '@gql/graphql';

const productHandleRegex = /^(?<uri>[^.]*).(?<id>\d+)$/;

export async function generateMetadata(
  props: { params: Promise<{ locale: string; handle: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { language } = localeParam.parse(params.locale);

  const { uri, id }: { uri?: string; id?: string } = params.handle.match(productHandleRegex)?.groups ?? {};

  if (!uri || !id) {
    return notFound();
  }

  const product = await getProductDetails({ id: Number(id) });

  if (!product) {
    return notFound();
  }

  const translations = product.translations.find((translation) => translation.language.code === language);

  return {
    title: translations?.metaTitle || translations?.name,
    description: translations?.metaDescription || (await parent).description,
    alternates: {
      canonical: `/${params.locale}/product/${params.handle}`,
      languages: await generateAlternates(
        (lang) => `/product/${product.translations.find(({ language }) => language.code === lang)?.uri ?? uri}.${id}`,
      ),
    },
    openGraph: {
      images:
        product.media.length > 0
          ? product.media.map((medium) => ({
              url: medium.source.url,
              alt: translations?.name,
            }))
          : (await parent).openGraph?.images,
    },
  };
}

export default async function ProductPage(props: { params: Promise<{ handle: string; locale: string }> }) {
  const params = await props.params;
  const { language, country } = localeParam.parse(params.locale);

  const { uri, id }: { uri?: string; id?: string } = params.handle.match(productHandleRegex)?.groups ?? {};

  if (!uri || !id) {
    return notFound();
  }

  const product = await getProductDetails({ id: Number(id) });

  if (!product) {
    return notFound();
  }

  const translations = product.translations.find((translation) => translation.language.code === language);

  if (translations?.uri !== uri) {
    if (translations?.uri) {
      return redirect(`/${params.locale}/product/${translations.uri}.${id}`);
    } else {
      return notFound();
    }
  }

  const { t } = await getTranslation(['shop']);

  return (
    <>
      <Suspense fallback={null}>
        <JsonLD productId={product.id} />
      </Suspense>
      <div className="grid grid-cols-1 justify-between gap-3 md:grid-cols-[minmax(13rem,53rem)_minmax(22rem,43rem)] md:gap-10 lg:gap-20">
        <ProductMedia productId={product.id} />
        <div className="flex flex-col gap-3 md:gap-5 md:only:col-span-2">
          <h1 className="text-4xl font-medium">{translations.name}</h1>
          <Suspense fallback={<div className="bg-mono-300 h-9 w-36 animate-pulse rounded-sm" />}>
            <WithSession>
              {({ market, pricelist }) => (
                <p className="text-3xl font-medium">
                  {product.bundle?.type === BundleType.Flexible &&
                  product.bundle.priceType === BundlePriceType.Dynamic ? (
                    <>
                      <span>
                        {
                          getPriceByMarketPricelist(product.bundle.minPriceByPricelist, market, pricelist)
                            ?.formattedValue
                        }
                      </span>
                      <span> - </span>
                      <span>
                        {
                          getPriceByMarketPricelist(product.bundle.maxPriceByPricelist, market, pricelist)
                            ?.formattedValue
                        }
                      </span>
                    </>
                  ) : (
                    getPriceByMarketPricelist(product.priceByPricelist, market, pricelist)?.formattedValue
                  )}
                </p>
              )}
            </WithSession>
          </Suspense>
          <ProductDescription description={translations.description.formatted} />
          <Bundle productId={product.id} />
          <Suspense
            fallback={
              <>
                <ItemSelectorSkeleton
                  items={product.items.map((item) => ({
                    id: item.id,
                    name: getItemName(item, country),
                  }))}
                />
                <div className="bg-mono-900 text-mono-0 flex w-full animate-pulse items-center justify-center px-6 py-4 text-xs font-bold uppercase sm:max-w-52">
                  {t('shop:product.add-to-cart')}
                </div>
              </>
            }
          >
            <Items productId={product.id} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
