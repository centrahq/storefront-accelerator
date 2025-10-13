import { Metadata } from 'next';

import { AddressForm } from '@/features/checkout/components/AddressForm/AddressForm';
import { InitiateOnlyPayments } from '@/features/checkout/components/Payment/InitiateOnlyPayments';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getCountries } from '@/lib/centra/dtc-api/fetchers/noSession';
import { getSession } from '@/lib/centra/sessionCookie';

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

  const countriesWithStates = countries
    .filter((country) => (country.states?.length ?? 0) > 0)
    .map((country) => country.code);

  return (
    <>
      <InitiateOnlyPayments countriesWithStates={countriesWithStates} />
      <div className="bg-mono-0 p-10">
        <AddressForm countries={countries} />
      </div>
    </>
  );
}
