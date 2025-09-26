import { Select } from '@headlessui/react';
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
    <Select
      value={subscription.plan?.id || ''}
      onChange={(e) => handleIntervalChange(Number(e.target.value))}
      disabled={updateIntervalMutation.isPending}
      className="border-mono-300 border px-2 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
  );
};
