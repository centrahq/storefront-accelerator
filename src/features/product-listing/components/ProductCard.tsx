import Image from 'next/image';
import { LinkProps } from 'next/link';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getSwatchColorCode } from '@/lib/utils/product';
import { BundlePriceType, BundleType, ListProductFragment } from '@gql/graphql';

const MAX_SWATCHES = 3;

export const ProductCardSkeleton = () => {
  return (
    <li className="flex flex-col animate-pulse">
      <div className="bg-mono-500 aspect-2/3" />
      <div className="px-4 py-3">
        <div className="bg-mono-500 mt-1 mb-2 h-4 w-1/2 rounded-xs" />
        <div className="bg-mono-500 h-4 mb-2 w-1/3 rounded-xs" />
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: MAX_SWATCHES }).map((_, index) => (
            <div key={index} className="size-4 bg-mono-500 border border-mono-500" />
          ))}
        </div>
      </div>
    </li>
  );
};

export const ProductCard = async ({
  product,
  prefetch,
  priority,
  imageSizes,
}: {
  product: ListProductFragment;
  prefetch?: LinkProps['prefetch'];
  priority?: boolean;
  imageSizes: string;
}) => {
  const variants = product.relatedDisplayItems.find(({ relation }) => relation === 'variant')?.displayItems ?? [];
  const { t } = await getTranslation(['server']);

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
  ].filter((variant) => Boolean(variant.color));

  return (
    <li key={product.id} className="relative flex flex-col">
      <div className="relative aspect-2/3">
        {product.media[0] && (
          <Image
            sizes={imageSizes}
            src={product.media[0].source.url}
            alt={product.media[0].altText || product.name}
            className="absolute inset-0 object-cover"
            fill
            priority={priority}
          />
        )}
      </div>
      <div className="px-4 py-3">
        <ShopLink
          href={`/product/${product.uri}`}
          className="font-medium after:absolute after:inset-0 after:content-['']"
          prefetch={prefetch}
        >
          {product.name}
        </ShopLink>
        <div className="text-mono-600">
          {product.bundle?.type === BundleType.Flexible &&
          product.bundle.priceType === BundlePriceType.Dynamic &&
          product.bundle.minPrice
            ? t('server:products.from-price', { price: product.bundle.minPrice.formattedValue })
            : product.price?.formattedValue}
        </div>
        {swatches.length > 1 && (
          <ul className="flex gap-2 flex-wrap mt-1">
            {swatches.slice(0, MAX_SWATCHES).map((swatch) => (
              <li key={swatch.uri}>
                <ShopLink
                  href={`/product/${swatch.uri}`}
                  className="block size-4 border border-mono-900 relative z-1"
                  style={{ backgroundColor: swatch.color }}
                  title={swatch.name}
                  prefetch
                >
                  <span className="sr-only">{swatch.name}</span>
                </ShopLink>
              </li>
            ))}
            {swatches.length > MAX_SWATCHES && (
              <li>
                <div className="size-4 flex items-center justify-center text-sm">+{swatches.length - MAX_SWATCHES}</div>
              </li>
            )}
          </ul>
        )}
      </div>
    </li>
  );
};
