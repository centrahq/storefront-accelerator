import { Metadata } from 'next';

import { AddressInfo } from '@/features/checkout/components/AddressInfo';
import { DeliveryForm } from '@/features/checkout/components/DeliveryForm';
import { getTranslation } from '@/features/i18n/useTranslation/server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation(['server']);

  return {
    title: t('server:checkout.delivery'),
  };
}

export default function DeliveryPage() {
  return (
    <>
      <AddressInfo />
      <div className="bg-mono-0 p-10">
        <DeliveryForm />
      </div>
    </>
  );
}
