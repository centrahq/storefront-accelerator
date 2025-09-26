import { useTranslation } from '@/features/i18n/useTranslation/client';
import { SubscriptionStatus as Status } from '@gql/graphql';

export const SubscriptionStatus = ({ status }: { status: Status }) => {
  const { t } = useTranslation(['shop']);
  const statusText = t('shop:user.subscriptions.status', { context: status });

  switch (status) {
    case Status.Active:
      return <span className="text-green-600">{statusText}</span>;
    case Status.Cancelled:
      return <span className="text-red-600">{statusText}</span>;
    case Status.Paused:
      return <span className="text-yellow-600">{statusText}</span>;
    default:
      return <span className="text-gray-600">{statusText}</span>;
  }
};
