'use client';

import { useMutationState, useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useContext } from 'react';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { useLocale } from '@/features/i18n/routing/useLocale';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { getItemName } from '@/lib/utils/product';
import { BundleType } from '@gql/graphql';

import type { useUpdateLine } from '../mutations';
import { selectionQuery } from '../queries';
import { CartContext } from './CartContext';
import { DeleteItemButton } from './DeleteItemButton';
import { EditItemQuantityButton } from './EditQuantityButton';

export const CartItems = () => {
  const { country } = useLocale();
  const { t } = useTranslation(['shop']);
  const { data } = useSuspenseQuery(selectionQuery);
  const { lines } = data;
  const { setIsCartOpen } = useContext(CartContext);

  const updateLineMutationVariables = useMutationState({
    filters: { mutationKey: ['selection', 'updateLine'], status: 'pending' },
    select: (mutation) => mutation.state.variables as ReturnType<typeof useUpdateLine>['variables'],
  });

  if (lines.length === 0) {
    return <span>{t('shop:cart.empty')}</span>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {lines
        .filter((line) => !!line)
        .map((line) => {
          const isUpdating = updateLineMutationVariables.some((variable) => variable?.id === line.id);

          return (
            <li key={line.id} className="bg-mono-50 flex gap-5 p-3">
              {line.displayItem.media[0] ? (
                <ShopLink
                  href={`/product/${line.displayItem.uri}`}
                  className="shrink-0"
                  onClick={() => setIsCartOpen(false)}
                >
                  <Image
                    className="size-20 object-cover"
                    src={line.displayItem.media[0].source.url}
                    alt={getItemName(line.item, country)}
                    width={80}
                    height={80}
                  />
                </ShopLink>
              ) : (
                <div className="size-20" />
              )}
              <div className="flex grow flex-col gap-2">
                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <ShopLink
                      className="font-medium"
                      href={`/product/${line.displayItem.uri}`}
                      onClick={() => setIsCartOpen(false)}
                    >
                      {line.displayItem.name}
                    </ShopLink>
                    <p className="shrink-0 text-sm">{isUpdating ? '...' : line.lineValue.formattedValue}</p>
                  </div>
                  {(line.__typename === 'ProductLine' || line.bundle?.type === BundleType.Fixed) && (
                    <dl className="flex gap-2 text-sm">
                      <dt className="text-mono-500">{t('shop:cart.size')}</dt>
                      <dd>{getItemName(line.item, country)}</dd>
                    </dl>
                  )}
                  {line.__typename === 'BundleLine' && line.bundle?.type === BundleType.Flexible && (
                    <ul className="list-inside list-disc text-sm">
                      {line.bundle.sections.flatMap((section) =>
                        section.lines.map((sectionLine) => (
                          <li key={sectionLine.id}>
                            {section.quantity}x {sectionLine.name} ({getItemName(sectionLine.item, country)})
                          </li>
                        )),
                      )}
                    </ul>
                  )}
                </div>
                <div className="flex items-end gap-3">
                  <div className="border-mono-300 bg-mono-0 text-mono-600 flex items-center gap-5 border px-2">
                    <EditItemQuantityButton line={line} type="decrease" />
                    <span className="text-sm font-medium">{line.quantity}</span>
                    <EditItemQuantityButton line={line} type="increase" />
                  </div>
                  <DeleteItemButton line={line} />
                </div>
              </div>
            </li>
          );
        })}
    </ul>
  );
};
