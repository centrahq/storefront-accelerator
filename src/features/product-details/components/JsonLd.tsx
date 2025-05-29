import { Product, WithContext } from 'schema-dts';

import { getProductAvailability, getProductDetails } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { getPriceByMarketPricelist } from '@/lib/utils/product';

export const JsonLD = async ({ productId }: { productId: number }) => {
  const { language, market, pricelist } = await getSession();

  const [product, productAvailability] = await Promise.all([
    getProductDetails({ id: productId }),
    getProductAvailability({
      id: productId,
      market,
      pricelist,
    }),
  ]);

  if (!product || !productAvailability) {
    return null;
  }

  const translations = product.translations.find((translation) => translation.language.code === language);

  const price = getPriceByMarketPricelist(product.priceByPricelist, market, pricelist);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          'name': translations?.metaTitle || translations?.name,
          'description': translations?.metaDescription,
          'image': product.media[0]?.source.url,
          'offers': {
            '@type': 'Offer',
            'availability': productAvailability.available ? 'InStock' : 'OutOfStock',
            'priceCurrency': price?.currency.code,
            'price': price?.value,
          },
        } satisfies WithContext<Product>),
      }}
    />
  );
};
