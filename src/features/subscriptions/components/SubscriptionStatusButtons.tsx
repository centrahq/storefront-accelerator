import { toast } from 'sonner';

import { useTranslation } from '@/features/i18n/useTranslation/client';
import { SubscriptionStatus as Status, SubscriptionInfoFragment } from '@gql/graphql';

import { useUpdateSubscriptionStatus } from '../mutations';

interface SubscriptionStatusButtonsProps {
  subscription: SubscriptionInfoFragment;
}

export const SubscriptionStatusButtons = ({ subscription }: SubscriptionStatusButtonsProps) => {
  const { t } = useTranslation(['shop']);
  const updateStatusMutation = useUpdateSubscriptionStatus();

  const handleStatusChange = (newStatus: Status) => {
    updateStatusMutation.mutate(
      {
        subscriptionId: subscription.id,
        status: newStatus,
      },
      {
        onError: () => {
          toast.error(t('shop:user.subscriptions.errors.update-status'));
        },
      },
    );
  };

  if (subscription.status === Status.Cancelled) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {subscription.status === Status.Paused && (
        <button
          type="button"
          onClick={() => handleStatusChange(Status.Active)}
          disabled={updateStatusMutation.isPending}
          className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600 disabled:opacity-50"
        >
          {t('shop:user.subscriptions.resume')}
        </button>
      )}
      {subscription.status === Status.Active && (
        <button
          type="button"
          onClick={() => handleStatusChange(Status.Paused)}
          disabled={updateStatusMutation.isPending}
          className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600 disabled:opacity-50"
        >
          {t('shop:user.subscriptions.pause')}
        </button>
      )}
      <button
        type="button"
        onClick={() => handleStatusChange(Status.Cancelled)}
        disabled={updateStatusMutation.isPending}
        className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 disabled:opacity-50"
      >
        {t('shop:user.subscriptions.cancel')}
      </button>
    </div>
  );
};
