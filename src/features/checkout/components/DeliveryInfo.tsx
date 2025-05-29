'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { useTranslation } from '@/features/i18n/useTranslation/client';

import { checkoutQuery } from '../queries';

export const DeliveryInfo = () => {
  const { data } = useSuspenseQuery(checkoutQuery);
  const { t } = useTranslation(['checkout']);

  const { widgets, shippingMethod } = data.checkout;

  const hasIngridWidget = widgets?.some(
    (widget) => widget.__typename === 'IngridWidget' && widget.deliveryOptionsAvailable,
  );

  if (hasIngridWidget || !shippingMethod) {
    return null;
  }

  return (
    <div className="bg-mono-0 p-10">
      <div className="mb-5 flex items-baseline gap-2">
        <h2 className="text-xl">{t('checkout:delivery')}</h2>
        <ShopLink href="/checkout/delivery" className="text-xs">
          {t('checkout:change')}
        </ShopLink>
      </div>
      <div className="flex flex-col gap-5">
        <span>
          {shippingMethod.name}
          {shippingMethod.price.value > 0 && <span> ({shippingMethod.price.formattedValue})</span>}
        </span>
        {shippingMethod.comment && <p>{shippingMethod.comment}</p>}
      </div>
    </div>
  );
};
