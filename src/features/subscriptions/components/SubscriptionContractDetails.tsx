import { useState } from 'react';

import { PlainAddress } from '@/components/PlainAddress';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { SubscriptionContractFragment } from '@gql/graphql';

import { SubscriptionAddressForm } from './SubscriptionAddressForm';
import { SubscriptionDetails } from './SubscriptionDetails';

export const SubscriptionContractDetails = ({ contract }: { contract: SubscriptionContractFragment }) => {
  const { t } = useTranslation(['shop', 'checkout']);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <div className="font-medium">{t('checkout:shipping-address')}:</div>
        {isEditingAddress ? (
          <SubscriptionAddressForm contract={contract} closeForm={() => setIsEditingAddress(false)} />
        ) : (
          <div>
            <PlainAddress address={contract.shippingAddress} />
            <button type="button" onClick={() => setIsEditingAddress(true)} className="text-sm font-semibold underline">
              {t('shop:user.subscriptions.edit-address')}
            </button>
          </div>
        )}
        <div className="font-medium">{t('checkout:delivery-method')}:</div>
        <div>{contract.shippingOption?.name}</div>
        <div className="font-medium">{t('checkout:payment-method')}:</div>
        <div>{contract.subscriptionPayment.map((payment) => payment.paymentMethod).join(', ')}</div>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-mono-900 text-xl font-bold">{t('shop:user.subscriptions.subscriptions')}</h3>
        {contract.subscriptions.map((subscription) => (
          <SubscriptionDetails key={subscription.id} subscription={subscription} />
        ))}
      </div>
    </div>
  );
};
