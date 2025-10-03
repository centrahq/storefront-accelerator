import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { ProductDetailsFragment } from '@gql/graphql';

interface Props {
  category: NonNullable<ProductDetailsFragment['category']>;
  productName: string;
  productUri: string;
}

export const ProductBreadcrumbs = async ({ category, productName, productUri }: Props) => {
  const { t } = await getTranslation(['server']);

  const categoryUris = category.uri.split('/');

  return (
    <nav className="flex items-center gap-2 text-xs" aria-label={t('server:breadcrumbs')}>
      <ol>
        <li className="inline">
          <ShopLink href="/" className="text-mono-900 hover:underline">
            {t('server:home')}
          </ShopLink>
          <span className="mx-3" aria-hidden="true">
            /
          </span>
        </li>
        {categoryUris.map((uri, index) => (
          <li key={uri} className="inline">
            <ShopLink href={`/${categoryUris.slice(0, index + 1).join('/')}`} className="text-mono-900 hover:underline">
              {category.name?.[index]}
            </ShopLink>
            <span className="mx-3" aria-hidden="true">
              /
            </span>
          </li>
        ))}
        <li className="inline">
          <ShopLink href={`/product/${productUri}`} className="text-mono-500" aria-current="page">
            {productName}
          </ShopLink>
        </li>
      </ol>
    </nav>
  );
};
