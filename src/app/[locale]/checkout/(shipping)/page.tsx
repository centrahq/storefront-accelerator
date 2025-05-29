import { AddressForm } from '@/features/checkout/components/AddressForm/AddressForm';
import { InitiateOnlyPayments } from '@/features/checkout/components/Payment/InitiateOnlyPayments';
import { localeParam } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getCountriesWithStates } from '@/lib/centra/dtc-api/fetchers/noSession';

export default async function ShippingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { language } = localeParam.parse((await params).locale);
  const { t } = await getTranslation(['server']);
  const countries = (await getCountriesWithStates())
    .map((country) => ({
      code: country.code,
      name: country.translations.find((translation) => translation.language.code === language)?.name ?? country.name,
      states: country.states?.toSorted((a, b) => a.name.localeCompare(b.name)),
    }))
    .toSorted((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <title>{t('server:checkout.checkout')}</title>
      <InitiateOnlyPayments />
      <div className="bg-mono-0 p-10">
        <AddressForm countries={countries} />
      </div>
    </>
  );
}
