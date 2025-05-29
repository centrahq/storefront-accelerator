import { getProductAvailability, getProductDetails } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';
import { getItemName } from '@/lib/utils/product';

import { BundleItemSelector } from './BundleItemSelector';

interface Props {
  productId: number;
  sectionId: number;
  bundledProductId: number;
}

export const BundledProductItems = async ({ productId, sectionId, bundledProductId }: Props) => {
  const { market, pricelist, country } = await getSession();

  const [displayData, displayAvailability] = await Promise.all([
    getProductDetails({ id: productId }).then((product) =>
      product?.bundle?.sections
        .find((section) => section.id === sectionId)
        ?.items.find((item) => item.id === bundledProductId),
    ),
    getProductAvailability({
      id: productId,
      market,
      pricelist,
    }).then((product) =>
      product?.bundle?.sections
        .find((section) => section.id === sectionId)
        ?.items.find((item) => item.id === bundledProductId),
    ),
  ]);

  if (!displayData || !displayAvailability) {
    return null;
  }

  const itemsData = displayData.items.map((item) => {
    return {
      id: item.id,
      isAvailable:
        displayAvailability.items.find((productItem) => productItem.id === item.id)?.stock.available ?? false,
      name: getItemName(item, country),
    };
  });

  return <BundleItemSelector items={itemsData} sectionId={sectionId} />;
};
