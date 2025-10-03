import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';

import { LocaleDate } from '@/components/LocaleDate';
import { Pagination } from '@/components/Pagination';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { OrderStatus } from '@/features/order/components/OrderStatus';
import { centraFetch } from '@/lib/centra/dtc-api/fetchers/session';
import { graphql } from '@gql/gql';
import { SelectionTotalRowType } from '@gql/graphql';

import { ORDER_LIMIT } from '../orderListConfig';
import { orderFilterParamsCache, serializeOrderFilters } from '../orderListSearchParams';
import { OrderDetails } from './OrderDetails';

const getOrders = async (page: number, limit: number) => {
  const ordersResponse = await centraFetch(
    graphql(`
      query orders($limit: Int!, $page: Int!) {
        customer {
          orders(limit: $limit, page: $page) {
            ...order
          }
          totalOrders
        }
      }
    `),
    {
      variables: { page, limit },
    },
  );

  return {
    orders: ordersResponse.data.customer?.orders ?? [],
    totalOrders: ordersResponse.data.customer?.totalOrders ?? 0,
  };
};

export const OrdersTable = async () => {
  const page = orderFilterParamsCache.get('ordersPage');

  const { orders, totalOrders } = await getOrders(page, ORDER_LIMIT);
  const { t } = await getTranslation(['server']);

  if (orders.length === 0) {
    return <p>{t('server:user.no-orders')}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="relative overflow-x-auto">
        <table className="text-mono-500 w-full text-left text-sm">
          <thead className="bg-mono-200 text-mono-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">{t('server:user.order-info.order')}</th>
              <th className="px-6 py-3">{t('server:user.order-info.date')}</th>
              <th className="px-6 py-3">{t('server:user.order-info.total')}</th>
              <th className="px-6 py-3">{t('server:user.order-info.address')}</th>
              <th className="px-6 py-3">{t('server:user.order-info.status')}</th>
              <th className="px-6 py-3 text-right">{t('server:user.order-info.action')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <Disclosure key={order.id}>
                <tr className="bg-mono-0 hover:bg-mono-100 border-b last:border-none">
                  <td className="px-6 py-4 font-medium">#{order.number}</td>
                  <td className="px-6 py-4">
                    <LocaleDate date={order.orderDate} />
                  </td>
                  <td className="px-6 py-4">
                    {
                      order.totals.find((total) => total.type === SelectionTotalRowType.GrandTotal)?.price
                        .formattedValue
                    }
                  </td>
                  <td className="px-6 py-4">
                    {order.shippingAddress?.country?.name}, {order.shippingAddress?.zipCode}
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatus status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DisclosureButton className="font-semibold hover:underline">
                      {t('server:user.order-info.view')}
                    </DisclosureButton>
                  </td>
                </tr>
                <DisclosurePanel as="tr" className="bg-mono-0 border-b last:border-none">
                  <td colSpan={6} className="px-6 py-4">
                    <OrderDetails order={order} />
                  </td>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </tbody>
        </table>
      </div>
      {totalOrders > ORDER_LIMIT && (
        <div className="ml-auto">
          <Pagination
            page={page}
            lastPage={Math.ceil(totalOrders / ORDER_LIMIT)}
            label={t('server:user.order-info.nav-label')}
            getPageHref={(page) => `/account/orders${serializeOrderFilters({ ordersPage: page })}`}
          />
        </div>
      )}
    </div>
  );
};
