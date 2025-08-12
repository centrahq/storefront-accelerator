import { AddressInfo } from '@/features/checkout/components/AddressInfo';
import { DeliveryInfo } from '@/features/checkout/components/DeliveryInfo';
import { GiftCardBox } from '@/features/checkout/components/Payment/GiftCardBox';
import { Payment } from '@/features/checkout/components/Payment/Payment';
import { getTranslation } from '@/features/i18n/useTranslation/server';

export default async function PaymentPage() {
  const { t } = await getTranslation(['server']);

  return (
    <>
      <title>{t('server:checkout.payment')}</title>
      <AddressInfo />
      <DeliveryInfo />
      <GiftCardBox />
      <div className="bg-mono-0 p-10">
        <Payment />
      </div>
    </>
  );
}
