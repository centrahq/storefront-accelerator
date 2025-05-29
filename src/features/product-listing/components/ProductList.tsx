import Image from 'next/image';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { BundlePriceType, BundleType, ProductsQuery } from '@gql/graphql';

export const ProductList = async ({ products }: { products: NonNullable<ProductsQuery['displayItems']['list']> }) => {
  const { t } = await getTranslation(['server']);

  return (
    <ul className="grid grid-cols-1 gap-10 sm:grid-cols-[repeat(auto-fill,minmax(25rem,1fr))]">
      {products.map((product, index) => (
        <li key={product.id} className="relative flex flex-col">
          <div className="relative aspect-23/20 grow">
            {product.media[0] && (
              <Image
                src={product.media[0].source.url}
                alt={product.name}
                className="absolute inset-0 object-cover"
                fill
                priority={index === 0}
              />
            )}
          </div>
          <div className="bg-mono-0 px-4 py-3">
            <ShopLink
              href={`/product/${product.uri}.${product.id}`}
              className="font-medium after:absolute after:inset-0 after:content-['']"
            >
              {product.name}
            </ShopLink>
            <p className="text-mono-600">
              {product.bundle?.type === BundleType.Flexible &&
              product.bundle.priceType === BundlePriceType.Dynamic &&
              product.bundle.minPrice
                ? t('server:products.from-price', { price: product.bundle.minPrice.formattedValue })
                : product.price?.formattedValue}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};
