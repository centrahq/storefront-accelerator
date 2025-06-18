import { AddressInfo } from '@/features/checkout/components/AddressInfo';
import { DeliveryForm } from '@/features/checkout/components/DeliveryForm';
import { getTranslation } from '@/features/i18n/useTranslation/server';

export default async function DeliveryPage() {
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
