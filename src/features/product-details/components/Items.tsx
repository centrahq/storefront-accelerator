import { AddToCartButton } from '@/features/cart/components/AddToCartButton';
import { localeParam } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { lookupProduct } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { getItemName } from '@/lib/utils/product';
import { BundleType } from '@gql/graphql';

import { ItemSelector } from './ItemSelector';

export const Items = async ({ productUri }: { productUri: string }) => {
  const { market, pricelist, country } = await getSession();
  const { language } = localeParam;
  const { t } = await getTranslation(['server']);

  const product = await lookupProduct({
    uri: productUri,
    language,
    market,
    pricelist,
  });

  if (!product.available) {
    return (
      <span className="block rounded-xs bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
        {t('server:product.out-of-stock')}
      </span>
    );
  }

  const itemsData = product.items.map((item) => ({
    id: item.id,
    isAvailable: item.stock.available,
    name: getItemName(item, country),
  }));

  const bundleItemAvailability =
    product.bundle?.sections.reduce<{
      [sectionId: number]: { [itemId: string]: boolean };
    }>((acc, section) => {
      acc[section.id] = section.items
        .flatMap((product) => product.items)
        .reduce<{ [itemId: string]: boolean }>((itemAcc, item) => {
          itemAcc[item.id] = item.stock.available;

          return itemAcc;
        }, {});

      return acc;
    }, {}) ?? {};

  return (
    <>
      {itemsData.length > 1 && <ItemSelector items={itemsData} />}
      <AddToCartButton
        items={itemsData}
        isFlexibleBundle={product.bundle?.type === BundleType.Flexible}
        bundleItemAvailability={bundleItemAvailability}
      />
    </>
  );
};
