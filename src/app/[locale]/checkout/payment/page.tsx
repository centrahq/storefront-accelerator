import { AddressInfo } from '@/features/checkout/components/AddressInfo';
import { DeliveryInfo } from '@/features/checkout/components/DeliveryInfo';
import { Payment } from '@/features/checkout/components/Payment/Payment';
import { localeParam } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';

export default async function PaymentPage({ params }: { params: Promise<{ locale: string }> }) {
  localeParam.parse((await params).locale);
  const { t } = await getTranslation(['server']);

  return (
    <>
      <title>{t('server:checkout.payment')}</title>
      <AddressInfo />
      <DeliveryInfo />
      <div className="bg-mono-0 p-10">
        <Payment />
      </div>
    </>
  );
}
