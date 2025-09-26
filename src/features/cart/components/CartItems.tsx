'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { toast } from 'sonner';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { useLocale } from '@/features/i18n/routing/useLocale';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { getItemName } from '@/lib/utils/product';
import { BundleType, LineFragment } from '@gql/graphql';

import { useUpdateLine } from '../mutations';
import { selectionQuery } from '../queries';

const CartItem = ({ line }: { line: LineFragment }) => {
  const { country } = useLocale();
  const { t } = useTranslation(['shop']);
  const updateLineMutation = useUpdateLine();

  const optimisticQuantity = updateLineMutation.isPending ? updateLineMutation.variables.quantity : line.quantity;
  const [quantity, setQuantity] = useDebouncedState(optimisticQuantity, (newQuantity) => {
    updateLineMutation.mutate(
      { id: line.id, subscriptionPlanId: line.subscriptionId, quantity: newQuantity },
      {
        onError: () => {
          toast.error(t('shop:cart.errors.update'));
        },
      },
    );
  });

  const deleteItem = () => {
    updateLineMutation.mutate(
      { id: line.id, quantity: 0 },
      {
        onError: () => {
          toast.error(t('shop:cart.errors.delete'));
        },
      },
    );
  };

  const subscription = line.displayItem.subscriptionPlans.find((plan) => plan.id === line.subscriptionId);

  if (optimisticQuantity === 0) {
    return null;
  }

  return (
    <li className="bg-mono-50 flex gap-5 p-3">
      {line.displayItem.media[0] ? (
        <ShopLink href={`/product/${line.displayItem.uri}`} className="shrink-0">
          <Image
            className="size-20 object-cover"
            src={line.displayItem.media[0].source.url}
            alt={line.displayItem.media[0].altText || line.displayItem.name}
            width={80}
            height={80}
          />
        </ShopLink>
      ) : (
        <div className="size-20" />
      )}
      <div className="flex grow flex-col gap-2">
        <div className="flex items-baseline justify-between gap-1">
          <div className="flex flex-col">
            <ShopLink className="font-medium" href={`/product/${line.displayItem.uri}`}>
              {line.displayItem.name}
            </ShopLink>
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
          <div className="min-w-24 shrink-0 text-right text-sm">
            {updateLineMutation.isPending ? (
              '...'
            ) : (
              <span>
                {line.lineValue.formattedValue}
                {subscription && (
                  <span className="text-xs">
                    <br />
                    {t('shop:cart.subscriptions.every', {
                      count: subscription.interval.value,
                      context: subscription.interval.type,
                    })}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-end gap-3">
          <div className="border-mono-300 bg-mono-0 text-mono-600 flex items-center gap-5 border px-2">
            <button type="button" className="font-bold" onClick={() => setQuantity(Math.max(0, quantity - 1))}>
              <span aria-hidden>-</span>
              <span className="sr-only">{t('shop:cart.decrease')}</span>
            </button>
            <span className="min-w-[2ch] text-center font-mono text-sm font-medium">{quantity}</span>
            <button type="button" className="font-bold" onClick={() => setQuantity(quantity + 1)}>
              <span aria-hidden>+</span>
              <span className="sr-only">{t('shop:cart.increase')}</span>
            </button>
          </div>
          <button type="button" onClick={deleteItem} className="text-xs font-medium underline">
            {t('shop:cart.delete')}
          </button>
        </div>
      </div>
    </li>
  );
};

export const CartItems = () => {
  const { t } = useTranslation(['shop']);
  const { data } = useSuspenseQuery(selectionQuery);
  const { lines } = data;

  if (lines.length === 0) {
    return <span>{t('shop:cart.empty')}</span>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {lines
        .filter((line) => !!line)
        .map((line) => (
          <CartItem key={line.id} line={line} />
        ))}
    </ul>
  );
};
