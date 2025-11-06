import { Metadata } from 'next';

import { AddressForm } from '@/features/checkout/components/AddressForm/AddressForm';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getSession } from '@/lib/centra/sessionCookie';
import { getCountries } from '@/lib/centra/storefront-api/fetchers/noSession';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation(['server']);

  return {
    title: t('server:checkout.checkout'),
  };
}

export default async function ShippingPage() {
  const { language } = await getSession();
  const countries = (await getCountries())
    .map((country) => ({
      code: country.code,
      name: country.translations.find((translation) => translation.language.code === language)?.name ?? country.name,
      states: country.states?.toSorted((a, b) => a.name.localeCompare(b.name)),
    }))
    .toSorted((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-mono-0 p-10">
      <AddressForm countries={countries} />
    </div>
  );
}
