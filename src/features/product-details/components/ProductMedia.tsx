import Image from 'next/image';

import { localeParam } from '@/features/i18n/routing/localeParam';
import { getProductDetails } from '@/lib/centra/dtc-api/fetchers/noSession';

export const ProductMedia = async ({ productId }: { productId: number }) => {
  const product = await getProductDetails({ id: productId });
  const { language } = localeParam;

  if (!product) {
    return null;
  }

  const [firstImage, ...restImages] = product.media;

  if (!firstImage) {
    return null;
  }

  const translations = product.translations.find((translation) => translation.language.code === language);

  return (
    <div className="flex h-full gap-6 overflow-x-auto max-md:h-[40vh] md:flex-col">
      <div className="relative aspect-3/4 w-full">
        <Image
          src={firstImage.source.url}
          alt={translations?.name ?? ''}
          className="object-cover"
          priority
          fill
          sizes="(min-width: 1800px) 848px, (min-width: 768px) 45vw, 100vw"
        />
      </div>
      <div className="contents md:grid md:grid-cols-2 md:gap-6">
        {restImages.map((image) => (
          <div key={image.source.url} className="relative aspect-3/4 md:aspect-square">
            <Image
              src={image.source.url}
              alt={translations?.name ?? ''}
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
