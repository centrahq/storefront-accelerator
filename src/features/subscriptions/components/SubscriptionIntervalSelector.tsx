import { Select } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

import { useTranslation } from '@/features/i18n/useTranslation/client';
import { SubscriptionInfoFragment, SubscriptionPlanFragment } from '@gql/graphql';

import { useUpdateSubscriptionInterval } from '../mutations';

interface SubscriptionIntervalSelectorProps {
  subscription: SubscriptionInfoFragment;
  availablePlans: SubscriptionPlanFragment[];
}

export const SubscriptionIntervalSelector = ({ subscription, availablePlans }: SubscriptionIntervalSelectorProps) => {
  const { t } = useTranslation(['shop']);
  const updateIntervalMutation = useUpdateSubscriptionInterval();

  const handleIntervalChange = (subscriptionPlanId: number) => {
    updateIntervalMutation.mutate(
      {
        subscriptionId: subscription.id,
        subscriptionPlanId,
      },
      {
        onError: () => {
          toast.error(t('shop:user.subscriptions.errors.update-interval'));
        },
      },
    );
  };

  return (
    <div className="relative flex items-center">
      <Select
        value={subscription.plan?.id || ''}
        onChange={(e) => handleIntervalChange(Number(e.target.value))}
        disabled={updateIntervalMutation.isPending}
        className="border-mono-300 bg-mono-0 block w-full appearance-none border py-1 pr-6 pl-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        {availablePlans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {t('shop:product.subscriptions.every', {
              count: plan.interval.value,
              context: plan.interval.type,
            })}
            {plan.discount && plan.discount > 0 && (
              <> ({t('shop:product.subscriptions.save-percent', { discount: plan.discount })})</>
            )}
          </option>
        ))}
      </Select>
      <ChevronDownIcon className="pointer-events-none absolute right-2 size-4" aria-hidden="true" />
    </div>
  );
};
