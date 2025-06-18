import Image from 'next/image';

import { lookupProduct } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';

export const ProductMedia = async ({ productUri }: { productUri: string }) => {
  const { market, pricelist, language } = await getSession();
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
          alt={product.media[0].altText || product.name}
          className="object-cover"
          priority
          fill
          sizes="(min-width: 1800px) 848px, (min-width: 768px) 45vw, 30vh"
          fetchPriority="high"
        />
      </div>
      {product.media.length > 1 && (
        <div className="contents md:grid md:grid-cols-2 md:gap-6">
          {product.media.slice(1).map((medium) => (
            <div key={medium.id} className="relative aspect-3/4 md:aspect-square">
              <Image
                src={medium.source.url}
                alt={medium.altText || product.name}
                className="object-cover"
                fill
                sizes="(min-width: 1800px) 412px, (min-width: 768px) 22vw, 30vh"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
