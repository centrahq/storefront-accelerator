import clsx from 'clsx';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getSwatchColorCode } from '@/lib/utils/product';
import { ProductDetailsFragment } from '@gql/graphql';

export const Variants = async ({ product }: { product: ProductDetailsFragment }) => {
  const { t } = await getTranslation(['server']);

  const variants = product.relatedDisplayItems.find(({ relation }) => relation === 'variant')?.displayItems ?? [];

  const swatches = [
    {
      uri: product.uri,
      color: getSwatchColorCode(product.swatch),
      name: product.productVariant.name ?? '',
    },
    ...variants.map((relatedProduct) => ({
      uri: relatedProduct.uri,
      color: getSwatchColorCode(relatedProduct.swatch),
      name: relatedProduct.productVariant.name ?? '',
    })),
  ]
    .filter((variant) => Boolean(variant.color))
    .sort((a, b) => a.uri.localeCompare(b.uri));

  if (swatches.length < 2) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold">{t('server:product.color')}</h2>
      <span className="text-mono-800 text-sm font-medium">{product.productVariant.name}</span>
      <ul className="flex flex-wrap gap-2">
        {swatches.map((swatch) => (
          <li key={swatch.uri}>
            <ShopLink
              href={`/product/${swatch.uri}`}
              className={clsx('border-mono-900 block size-5 border', {
                'ring-2 ring-blue-400': swatch.uri === product.uri,
              })}
              aria-current={swatch.uri === product.uri ? 'page' : undefined}
              style={{ backgroundColor: swatch.color }}
              title={swatch.name}
              prefetch
            >
              <span className="sr-only">{swatch.name}</span>
            </ShopLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
