import { getTranslation } from '@/features/i18n/useTranslation/server';
import { OrderStatus as Status } from '@gql/graphql';

export const OrderStatus = async ({ status }: { status: Status }) => {
  const { t } = await getTranslation(['server']);
  const statusText = t('server:user.order-info.status', { context: status });

  switch (status) {
    case Status.Archived:
    case Status.Deleted:
      return <span className="text-red-600">{statusText}</span>;
    case Status.Confirmed:
      return <span className="text-green-600">{statusText}</span>;
    case Status.Pending:
      return <span className="text-yellow-600">{statusText}</span>;
    case Status.Processing:
    case Status.Shipped:
      return <span className="text-blue-600">{statusText}</span>;
  }
};
