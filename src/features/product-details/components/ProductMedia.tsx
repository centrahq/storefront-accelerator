import Image from 'next/image';

import { localeParam } from '@/features/i18n/routing/localeParam';
import { lookupProduct } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';

export const ProductMedia = async ({ productUri }: { productUri: string }) => {
  const { language } = localeParam;
  const { market, pricelist } = await getSession();
  const product = await lookupProduct({
    uri: productUri,
    language,
    market,
    pricelist,
  });

  if (!product.media[0]) {
    return null;
  }

  return (
    <div className="flex h-full gap-6 overflow-x-auto max-md:h-[40vh] md:flex-col">
      <div className="relative aspect-3/4 w-full">
        <Image
          src={product.media[0].source.url}
          alt={product.name}
          className="object-cover"
          priority
          fill
          sizes="(min-width: 1800px) 848px, (min-width: 768px) 45vw, 100vw"
        />
      </div>
      <div className="contents md:grid md:grid-cols-2 md:gap-6">
        {product.media.slice(1).map((image) => (
          <div key={image.source.url} className="relative aspect-3/4 md:aspect-square">
            <Image
              src={image.source.url}
              alt={product.name}
              className="object-cover"
              fill
              sizes="(min-width: 1800px) 412px, (min-width: 768px) 22vw, 100vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
