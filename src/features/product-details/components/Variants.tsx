import clsx from 'clsx';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { lookupProduct } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { getSwatchColorCode } from '@/lib/utils/product';

export const Variants = async ({ productUri }: { productUri: string }) => {
  const { market, pricelist, language } = await getSession();
  const product = await lookupProduct({
    uri: productUri,
    language,
    market,
    pricelist,
  });
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
    .sort((a, b) => a.name.localeCompare(b.name));

  if (swatches.length < 2) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold">{t('server:product.color')}</h2>
      <span className="text-sm font-medium text-mono-800">{product.productVariant.name}</span>
      <ul className="flex gap-2 flex-wrap">
        {swatches.map((swatch) => (
          <li key={swatch.uri}>
            <ShopLink
              href={`/product/${swatch.uri}`}
              className={clsx('block size-5 border border-mono-900', {
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
