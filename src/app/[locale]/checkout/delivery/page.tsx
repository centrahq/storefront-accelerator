import { AddressInfo } from '@/features/checkout/components/AddressInfo';
import { DeliveryForm } from '@/features/checkout/components/DeliveryForm';
import { localeParam } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';

export default async function DeliveryPage({ params }: { params: Promise<{ locale: string }> }) {
  localeParam.parse((await params).locale);
  const { t } = await getTranslation(['server']);

  return (
    <>
      <title>{t('server:checkout.delivery')}</title>
      <AddressInfo />
      <div className="bg-mono-0 p-10">
        <DeliveryForm />
      </div>
    </>
  );
}
