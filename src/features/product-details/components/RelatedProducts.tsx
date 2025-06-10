import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ProductCard } from '@/features/product-listing/components/ProductCard';
import { ListProductFragment } from '@gql/graphql';

export const RelatedProducts = async ({ relatedProducts }: { relatedProducts: Promise<ListProductFragment[]> }) => {
  const products = await relatedProducts;

  if (products.length === 0) {
    return null;
  }

  const { t } = await getTranslation(['server']);

  return (
    <div className="flex flex-col gap-4 mt-8">
      <h2 className="text-2xl font-medium">{t('server:product.related-products')}</h2>
      <ul className="flex gap-8 overflow-x-auto *:basis-[clamp(16rem,25vw,24rem)] *:shrink-0 *:grow-0 custom-scrollbar">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
};
