import Image from 'next/image';

import { LocaleDate } from '@/components/LocaleDate';
import { PlainAddress } from '@/components/PlainAddress';
import { TotalRow } from '@/components/TotalRow';
import { localeParam } from '@/features/i18n/routing/localeParam';
import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getItemName } from '@/lib/utils/product';
import { BundleType, OrderFragment, SelectionTotalRowType } from '@gql/graphql';

import { OrderStatus } from './OrderStatus';

export const OrderDetails = async ({ order }: { order: OrderFragment }) => {
  const { country } = localeParam;
  const { t } = await getTranslation(['server', 'checkout', 'shop']);

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <dt className="font-medium">{t('server:checkout.order-summary.number')}:</dt>
        <dd>#{order.number}</dd>
        <dt className="font-medium">{t('server:checkout.order-summary.date')}:</dt>
        <dd>
          <LocaleDate date={order.orderDate} />
        </dd>
        <dt className="font-medium">{t('server:checkout.order-summary.status')}:</dt>
        <dd>
          <OrderStatus status={order.status} />
        </dd>
        {order.shippingAddress && (
          <>
            <dt className="font-medium">{t('checkout:shipping-address')}:</dt>
            <dd>
              <PlainAddress address={order.shippingAddress} />
            </dd>
          </>
        )}
        {order.billingAddress && (
          <>
            <dt className="font-medium">{t('checkout:billing-address')}:</dt>
            <dd>
              <PlainAddress address={order.billingAddress} />
            </dd>
          </>
        )}
        {order.shippingMethod.name && (
          <>
            <dt className="font-medium">{t('checkout:delivery')}:</dt>
            <dd>{order.shippingMethod.name}</dd>
          </>
        )}
      </dl>

      <ul className="flex flex-col gap-2">
        {order.lines
          .filter((line) => !!line)
          .map((line) => {
            return (
              <li key={line.id} className="bg-mono-50 flex gap-5 py-3">
                {line.displayItem.media[0] ? (
                  <ShopLink href={`/product/${line.displayItem.uri}`} className="shrink-0">
                    <Image
                      className="size-20 object-cover"
                      src={line.displayItem.media[0].source.url}
                      alt={line.displayItem.media[0].altText || line.displayItem.name}
                      width={80}
                      height={80}
                    />
                  </ShopLink>
                ) : (
                  <div className="size-20" />
                )}
                <div className="flex grow flex-col gap-2">
                  <div>
                    <div className="flex items-baseline justify-between gap-1">
                      <ShopLink className="font-medium" href={`/product/${line.displayItem.uri}`}>
                        {line.displayItem.name}
                      </ShopLink>
                      <div className="shrink-0 text-sm">{line.lineValue.formattedValue}</div>
                    </div>
                    <dl>
                      {(line.__typename === 'ProductLine' || line.bundle?.type === BundleType.Fixed) && (
                        <div className="flex gap-2 text-sm">
                          <dt className="text-mono-500">{t('shop:cart.size')}:</dt>
                          <dd>{getItemName(line.item, country)}</dd>
                        </div>
                      )}
                      <div className="flex gap-2 text-sm">
                        <dt className="text-mono-500">{t('shop:cart.quantity')}:</dt>
                        <dd>{line.quantity}</dd>
                      </div>
                    </dl>
                    {line.__typename === 'BundleLine' && line.bundle?.type === BundleType.Flexible && (
                      <ul className="list-inside list-disc text-sm">
                        {line.bundle.sections.flatMap((section) =>
                          section.lines.map((sectionLine) => (
                            <li key={sectionLine.id}>
                              {section.quantity}x {sectionLine.name} ({getItemName(sectionLine.item, country)})
                            </li>
                          )),
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
      </ul>

      <div className="flex flex-col gap-3">
        <h3 className="font-medium">{t('checkout:totals')}</h3>
        <dl className="text-mono-500 text-sm">
          <TotalRow
            totals={order.totals}
            type={SelectionTotalRowType.ItemsSubtotal}
            term={t('checkout:receipt.subtotal')}
          />
          <TotalRow
            totals={order.totals}
            type={SelectionTotalRowType.Discount}
            term={t('checkout:receipt.discount')}
            optional
          />
          <TotalRow
            totals={order.totals}
            type={SelectionTotalRowType.Credit}
            term={t('checkout:receipt.credit')}
            optional
          />
          <TotalRow totals={order.totals} type={SelectionTotalRowType.Shipping} term={t('checkout:receipt.shipping')} />
          <TotalRow
            totals={order.totals}
            type={SelectionTotalRowType.Handling}
            term={t('checkout:receipt.handling')}
            optional
          />
        </dl>
        <dl className="text-mono-900 text-base">
          <TotalRow
            totals={order.totals}
            type={SelectionTotalRowType.GrandTotal}
            term={t('checkout:receipt.grand-total')}
          />
        </dl>
      </div>
    </div>
  );
};
