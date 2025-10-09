import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ProductCard, ProductCardSkeleton } from '@/features/product-listing/components/ProductCard';
import { getRelatedProducts } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';

const RelatedProductsRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <ul className="custom-scrollbar flex gap-8 overflow-x-auto *:shrink-0 *:grow-0 *:basis-[clamp(16rem,25vw,24rem)]">
      {children}
    </ul>
  );
};

export const RelatedProductsSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      <h2 className="bg-mono-500 h-8 w-48 rounded-xs" />
      <RelatedProductsRow>
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </RelatedProductsRow>
    </div>
  );
};

export const RelatedProducts = async ({ id }: { id: number }) => {
  const { market, pricelist, language } = await getSession();

  const products = await getRelatedProducts({
    id,
    language,
    market,
    pricelist,
  }).catch(() => []);

  if (products.length === 0) {
    return null;
  }

  const { t } = await getTranslation(['server']);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-medium">{t('server:product.related-products')}</h2>
      <RelatedProductsRow>
        {products.map((product) => (
          <ProductCard key={product.id} imageSizes="384px" product={product} />
        ))}
      </RelatedProductsRow>
    </div>
  );
};
