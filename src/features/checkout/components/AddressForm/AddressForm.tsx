'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { useTranslation } from '@/features/i18n/useTranslation/client';

import { checkoutQuery } from '../../queries';
import { Widget } from '../Widget';
import { NativeAddressForm } from './NativeAddressForm';

interface AddressProps {
  countries: Array<{
    code: string;
    name: string;
    states?: Array<{
      name: string;
      code: string;
    }>;
  }>;
}

export const AddressForm = ({ countries }: AddressProps) => {
  const { data } = useSuspenseQuery(checkoutQuery);
  const { widgets } = data.checkout;
  const { t } = useTranslation(['checkout']);

  const ingridWidget = widgets?.find((widget) => widget.__typename === 'IngridWidget');

  if (!ingridWidget?.deliveryOptionsAvailable) {
    return (
      <NativeAddressForm
        key={JSON.stringify([data.checkout.shippingAddress, data.checkout.separateBillingAddress])}
        countries={countries}
      />
    );
  }

  return (
    <>
      <Widget
        html={ingridWidget.snippet}
        onMount={() => {
          window.CentraCheckout?.reInitiate('ingrid');
        }}
        cleanUp={() => {
          window._sw?.((api) => api.destroy?.());
        }}
      />
      <ShopLink
        href="/checkout/payment"
        className="bg-mono-900 text-mono-0 mt-5 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase"
      >
        {t('checkout:continue')}
      </ShopLink>
    </>
  );
};
