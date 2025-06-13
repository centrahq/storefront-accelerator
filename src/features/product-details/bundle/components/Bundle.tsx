import Image from 'next/image';

import { localeParam } from '@/features/i18n/routing/localeParam';
import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { lookupProduct } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { getItemName } from '@/lib/utils/product';
import { BundleType } from '@gql/graphql';

import { BundleItemSelector } from './BundleItemSelector';

export const Bundle = async ({ productUri }: { productUri: string }) => {
  const { language, country } = localeParam;
  const { market, pricelist } = await getSession();

  const product = await lookupProduct({
    uri: productUri,
    language,
    market,
    pricelist,
  });

  const sections = product.bundle?.sections.filter((section) => section.items.length > 0);

  if (!sections || sections.length === 0) {
    return null;
  }

  const { t } = await getTranslation(['shop']);

  return (
    <ul className="flex flex-col gap-4">
      {sections.map((section) => (
        <li key={section.id} className="rounded-xs border border-gray-300 p-4">
          <ul className="flex flex-col gap-4">
            {section.items.map((sectionItem) => {
              return (
                <li key={sectionItem.id} className="flex flex-row gap-4">
                  {sectionItem.media[0] && (
                    <div className="shrink-0">
                      <ShopLink href={`/product/${sectionItem.uri}`}>
                        <Image
                          src={sectionItem.media[0].source.url}
                          alt={sectionItem.media[0].altText || sectionItem.name}
                          className="object-cover"
                          width={96}
                          height={128}
                          unoptimized
                        />
                      </ShopLink>
                    </div>
                  )}
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex w-full flex-row items-center justify-between gap-2">
                      <ShopLink href={`/product/${sectionItem.uri}`}>{sectionItem.name}</ShopLink>
                      <span>{sectionItem.price?.formattedValue}</span>
                    </div>
                    <dl className="flex flex-col gap-2">
                      <div className="flex gap-2 text-sm">
                        <dt className="text-mono-500">{t('shop:cart.quantity')}:</dt>
                        <dd>{section.quantity}</dd>
                      </div>
                    </dl>
                    {product.bundle?.type === BundleType.Flexible && (
                      <BundleItemSelector
                        sectionId={section.id}
                        items={sectionItem.items.map((item) => ({
                          id: item.id,
                          isAvailable: item.stock.available,
                          name: getItemName(item, country),
                        }))}
                      />
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
