import Image from 'next/image';
import { Suspense } from 'react';

import { WithSession } from '@/components/WithSession';
import { localeParam } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getProductDetails } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getItemName, getPriceByMarketPricelist } from '@/lib/utils/product';
import { BundleType } from '@gql/graphql';

import { ItemSelectorSkeleton } from '../../components/ItemSelectorSkeleton';
import { BundledProductItems } from './BundledProductItems';

interface Props {
  productId: number;
}

export const Bundle = async ({ productId }: Props) => {
  const productDetails = await getProductDetails({ id: productId });

  const sections = productDetails?.bundle?.sections.filter((section) => section.items.length > 0);

  if (!sections || sections.length === 0) {
    return null;
  }

  const { t } = await getTranslation(['shop']);
  const { language, country } = localeParam;

  return (
    <ul className="flex flex-col gap-4">
      {sections.map((section) => (
        <li key={section.id} className="rounded-xs border border-gray-300 p-4">
          <ul className="flex flex-col gap-4">
            {section.items.map((sectionItem) => {
              const translations = sectionItem.translations.find(
                (translation) => translation.language.code === language,
              );

              return (
                <li key={sectionItem.id} className="flex flex-row gap-4">
                  {sectionItem.media[0] && (
                    <div>
                      <div className="relative aspect-3/4 w-[6rem]">
                        <Image src={sectionItem.media[0].source.url} alt="" className="object-cover" fill />
                      </div>
                    </div>
                  )}
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex w-full flex-row items-center justify-between gap-2">
                      <p>{translations?.name ?? sectionItem.name}</p>
                      <Suspense fallback={<div className="bg-mono-300 h-6 w-24 animate-pulse rounded-sm" />}>
                        <WithSession>
                          {({ market, pricelist }) => (
                            <p>
                              {
                                getPriceByMarketPricelist(sectionItem.priceByPricelist, market, pricelist)
                                  ?.formattedValue
                              }
                            </p>
                          )}
                        </WithSession>
                      </Suspense>
                    </div>
                    <dl className="flex flex-col gap-2">
                      <div className="flex gap-2 text-sm">
                        <dt className="text-mono-500">{t('shop:cart.quantity')}:</dt>
                        <dd>{section.quantity}</dd>
                      </div>
                    </dl>
                    {productDetails?.bundle?.type === BundleType.Flexible && (
                      <Suspense
                        fallback={
                          <ItemSelectorSkeleton
                            items={sectionItem.items.map((item) => ({
                              id: item.id,
                              name: getItemName(item, country),
                            }))}
                            hiddenLegend
                          />
                        }
                      >
                        <BundledProductItems
                          productId={productId}
                          sectionId={section.id}
                          bundledProductId={sectionItem.id}
                        />
                      </Suspense>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
};
