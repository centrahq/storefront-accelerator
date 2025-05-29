import clsx from 'clsx';

import { getTranslation } from '@/features/i18n/useTranslation/server';

interface Props {
  items: Array<{
    id: string;
    name: string;
  }>;
  hiddenLegend?: boolean;
}

export const ItemSelectorSkeleton = async ({ items, hiddenLegend = false }: Props) => {
  if (items.length < 2) {
    return null;
  }

  const { t } = await getTranslation(['shop']);

  return (
    <div className="flex animate-pulse flex-col gap-3">
      <h2 className={clsx('text-xl font-medium', { 'sr-only': hiddenLegend })}>{t('shop:product.sizes')}</h2>
      <div className="flex flex-wrap gap-2 text-sm font-medium">
        {items.map((item) => (
          <div key={item.id} className="border-mono-300 border px-6 py-2 font-mono">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};
