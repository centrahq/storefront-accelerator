import { AddToCartButton } from '@/features/cart/components/AddToCartButton';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getSession } from '@/lib/centra/sessionCookie';
import { getItemName, getSizeGuideTable } from '@/lib/utils/product';
import { BundleType, ProductDetailsFragment } from '@gql/graphql';

import { ItemSelector } from './ItemSelector';
import { SubscriptionSelector } from './SubscriptionSelector';

export const Items = async ({ product }: { product: ProductDetailsFragment }) => {
  const { country } = await getSession();
  const { t } = await getTranslation(['server']);

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
    quantity: item.stock.quantity,
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

  const sizeGuideTable = getSizeGuideTable(product.sizeGuide);

  return (
    <>
      {itemsData.length > 1 && <ItemSelector items={itemsData} sizeGuideTable={sizeGuideTable} />}
      {product.bundle?.type !== BundleType.Flexible && itemsData.length === 1 && itemsData[0] && (
        <span className="text-mono-800 font-medium">
          <span>{t('server:product.stock')}:</span> <span>{itemsData[0].quantity}</span>
        </span>
      )}
      {product.subscriptionPlans.length > 0 && <SubscriptionSelector plans={product.subscriptionPlans} />}
      <AddToCartButton
        items={itemsData}
        product={product}
        isFlexibleBundle={product.bundle?.type === BundleType.Flexible}
        bundleItemAvailability={bundleItemAvailability}
      />
    </>
  );
};
