'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { LocaleDate } from '@/components/LocaleDate';
import { useTranslation } from '@/features/i18n/useTranslation/client';

import { subscriptionsContractsQuery } from '../queries';
import { SubscriptionContractDetails } from './SubscriptionContractDetails';

export const SubscriptionContractsTable = () => {
  const { data: subscriptions } = useSuspenseQuery(subscriptionsContractsQuery);
  const { t } = useTranslation(['shop', 'checkout']);

  if (subscriptions.length === 0) {
    return <p className="text-mono-500">{t('shop:user.subscriptions.no-subscriptions')}</p>;
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="text-mono-500 w-full text-left text-sm">
        <thead className="bg-mono-200 text-mono-600 text-xs uppercase">
          <tr>
            <th className="px-6 py-3">{t('shop:user.subscriptions.contract-id')}</th>
            <th className="px-6 py-3">{t('shop:user.subscriptions.created')}</th>
            <th className="px-6 py-3">{t('shop:user.subscriptions.address')}</th>
            <th className="px-6 py-3 text-right">{t('shop:user.subscriptions.action')}</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((contract) => (
            <Disclosure key={contract.id}>
              <tr className="bg-mono-0 hover:bg-mono-100 border-b last:border-none">
                <td className="px-6 py-4 font-medium">#{contract.id}</td>
                <td className="px-6 py-4">
                  <LocaleDate date={contract.createdAt} />
                </td>
                <td className="px-6 py-4">
                  {contract.shippingAddress.country?.name}, {contract.shippingAddress.zipCode}
                </td>
                <td className="px-6 py-4 text-right">
                  <DisclosureButton className="font-semibold hover:underline">
                    {t('shop:user.subscriptions.view')}
                  </DisclosureButton>
                </td>
              </tr>
              <DisclosurePanel as="tr" className="bg-mono-0 border-b last:border-none">
                <td colSpan={4} className="px-6 py-4">
                  <SubscriptionContractDetails contract={contract} />
                </td>
              </DisclosurePanel>
            </Disclosure>
          ))}
        </tbody>
      </table>
    </div>
  );
};
