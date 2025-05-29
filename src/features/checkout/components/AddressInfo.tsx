'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { PlainAddress } from '@/components/PlainAddress';
import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { useTranslation } from '@/features/i18n/useTranslation/client';

import { checkoutQuery } from '../queries';

export const AddressInfo = () => {
  const { t } = useTranslation(['checkout']);
  const { data } = useSuspenseQuery(checkoutQuery);
  const { shippingAddress, separateBillingAddress: billingAddress } = data.checkout;

  return (
    <div className="bg-mono-0 p-10 font-medium">
      <div className="mb-5 flex items-baseline gap-2">
        <h2 className="text-xl">{t('checkout:information')}</h2>
        <ShopLink href="/checkout" className="text-xs">
          {t('checkout:change')}
        </ShopLink>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <h3 className="font-bold">{t('checkout:shipping-address')}</h3>
          <PlainAddress address={shippingAddress} />
        </div>
        {billingAddress && (
          <div>
            <h3 className="font-bold">{t('checkout:billing-address')}</h3>
            <PlainAddress address={billingAddress} />
          </div>
        )}
      </div>
    </div>
  );
};
