import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from 'next/cache';

import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ProductCard } from '@/features/product-listing/components/ProductCard';
import { TAGS } from '@/lib/centra/constants';
import { centraFetchNoSession } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { graphql } from '@gql/gql';
import { RelatedProductsQueryVariables } from '@gql/graphql';

export const getRelatedProducts = async (variables: RelatedProductsQueryVariables) => {
  'use cache';

  const result = await centraFetchNoSession(
    graphql(`
      query relatedProducts($id: Int!, $language: String!, $market: Int!, $pricelist: Int!) {
        displayItem(id: $id, languageCode: [$language], market: [$market], pricelist: [$pricelist]) {
          relatedDisplayItems(relationType: "standard") {
            relation
            displayItems {
              ...listProduct
            }
          }
        }
      }
    `),
    {
      variables,
    },
  );

  const relatedProducts =
    result.data.displayItem?.relatedDisplayItems.find(({ relation }) => relation === 'standard')?.displayItems ?? [];

  cacheTag(TAGS.product(variables.id));
  relatedProducts.forEach((product) => {
    cacheTag(TAGS.product(product.id));
  });
  cacheLife('hours');

  return relatedProducts;
};

export const RelatedProducts = async ({ id }: { id: number }) => {
  const { market, pricelist, language } = await getSession();

  const products = await getRelatedProducts({
    id,
    language,
    market,
    pricelist,
  }).catch(() => []);

  if (products.length === 0) {
    return null;
  }

  const { t } = await getTranslation(['server']);

  return (
    <div className="flex flex-col gap-4 mt-8">
      <h2 className="text-2xl font-medium">{t('server:product.related-products')}</h2>
      <ul className="flex gap-8 overflow-x-auto *:basis-[clamp(16rem,25vw,24rem)] *:shrink-0 *:grow-0 custom-scrollbar">
        {products.map((product) => (
          <ProductCard key={product.id} imageSizes="384px" product={product} />
        ))}
      </ul>
    </div>
  );
};
