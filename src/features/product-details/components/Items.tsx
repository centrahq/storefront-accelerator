import { AddToCartButton } from '@/features/cart/components/AddToCartButton';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getProductAvailability, getProductDetails } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { getItemName } from '@/lib/utils/product';
import { BundleType } from '@gql/graphql';

import { ItemSelector } from './ItemSelector';

interface Props {
  productId: number;
}

export const Items = async ({ productId }: Props) => {
  const { market, pricelist, country } = await getSession();
  const { t } = await getTranslation(['server']);

  const [productDetails, productAvailability] = await Promise.all([
    getProductDetails({ id: productId }),
    getProductAvailability({
      id: productId,
      market,
      pricelist,
    }),
  ]);

  if (!productDetails || !productAvailability) {
    return null;
  }

  if (!productAvailability.available) {
    return (
      <span className="block rounded-xs bg-red-100 px-4 py-3 text-sm font-medium text-red-800">
        {t('server:product.out-of-stock')}
      </span>
    );
  }

  const itemsData = productDetails.items.map((item) => ({
    id: item.id,
    isAvailable: productAvailability.items.find((productItem) => productItem.id === item.id)?.stock.available ?? false,
    name: getItemName(item, country),
  }));

  const bundleItemAvailability =
    productAvailability.bundle?.sections.reduce<{
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
        isFlexibleBundle={productDetails.bundle?.type === BundleType.Flexible}
        bundleItemAvailability={bundleItemAvailability}
      />
    </>
  );
};
