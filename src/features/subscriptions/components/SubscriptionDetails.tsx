import { Field, Label } from '@headlessui/react';
import Image from 'next/image';

import { LocaleDate } from '@/components/LocaleDate';
import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { useLocale } from '@/features/i18n/routing/useLocale';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { getItemName } from '@/lib/utils/product';
import { BundleType, SubscriptionStatus as Status, SubscriptionInfoFragment } from '@gql/graphql';

import { SubscriptionIntervalSelector } from './SubscriptionIntervalSelector';
import { SubscriptionQuantitySelector } from './SubscriptionQuantitySelector';
import { SubscriptionStatus } from './SubscriptionStatus';
import { SubscriptionStatusButtons } from './SubscriptionStatusButtons';

export const SubscriptionDetails = ({ subscription }: { subscription: SubscriptionInfoFragment }) => {
  const { t } = useTranslation(['shop']);
  const { country } = useLocale();

  const line = subscription.lines[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1">
          <span className="font-medium">{t('shop:user.subscriptions.status')}:</span>
          <SubscriptionStatus status={subscription.status} />

          {subscription.status !== Status.Cancelled && line && line.displayItem.subscriptionPlans.length > 1 ? (
            <Field className="contents">
              <Label>{t('shop:user.subscriptions.interval')}:</Label>
              <SubscriptionIntervalSelector
                subscription={subscription}
                availablePlans={line.displayItem.subscriptionPlans}
              />
            </Field>
          ) : (
            <>
              <span className="font-medium">{t('shop:user.subscriptions.interval')}:</span>
              <span>
                {t('shop:product.subscriptions.every', {
                  count: subscription.interval.value,
                  context: subscription.interval.type,
                })}
              </span>
            </>
          )}

          {subscription.nextOrderDate && (
            <>
              <span className="font-medium">{t('shop:user.subscriptions.next-order')}:</span>
              <LocaleDate date={subscription.nextOrderDate} />
            </>
          )}
        </div>
        <SubscriptionStatusButtons subscription={subscription} />
      </div>
      {line && (
        <div key={line.id} className="bg-mono-50 flex gap-5 p-3">
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
                <div>
                  {(line.__typename === 'ProductLine' || line.bundle?.type === BundleType.Fixed) && (
                    <div className="flex gap-2 text-sm">
                      <span className="text-mono-500">{t('shop:cart.size')}:</span>
                      <span>{getItemName(line.item, country)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-mono-500">{t('shop:cart.quantity')}:</span>
                    {subscription.status === Status.Cancelled ? (
                      <span>{line.quantity}</span>
                    ) : (
                      <SubscriptionQuantitySelector subscription={subscription} />
                    )}
                  </div>
                </div>
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
              <div className="min-w-24 shrink-0 text-right text-sm">{line.lineValue.formattedValue}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
