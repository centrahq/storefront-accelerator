'use client';

import { useIsMutating, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { TotalRow } from '@/components/TotalRow';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { SelectionTotalRowType } from '@gql/graphql';

import { checkoutQuery } from '../../queries';
import { AddVoucherForm } from './AddVoucherForm';
import { VoucherList } from './VoucherList';

export const Totals = () => {
  const { data } = useSuspenseQuery(checkoutQuery);
  const totals = data.checkout.totals;

  const isMutatingCart = useIsMutating({ mutationKey: ['checkout', 'updateLine'] }) > 0;
  const { t } = useTranslation(['checkout']);
  const [isVoucherFormOpen, setIsVoucherFormOpen] = useState(false);

  return (
    <aside className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3>{t('checkout:totals')}</h3>
        <button
          type="button"
          className="text-sm font-medium underline"
          onClick={() => setIsVoucherFormOpen((open) => !open)}
        >
          {isVoucherFormOpen ? t('checkout:voucher.hide-voucher') : t('checkout:voucher.apply-voucher')}
        </button>
      </div>
      {isVoucherFormOpen && <AddVoucherForm />}
      <dl className="text-mono-500 text-sm">
        <TotalRow
          pending={isMutatingCart}
          totals={totals}
          type={SelectionTotalRowType.ItemsSubtotal}
          term={t('checkout:receipt.subtotal')}
        />
        <TotalRow
          pending={isMutatingCart}
          totals={totals}
          type={SelectionTotalRowType.Discount}
          term={t('checkout:receipt.discount')}
          optional
        />
        <TotalRow
          pending={isMutatingCart}
          totals={totals}
          type={SelectionTotalRowType.Credit}
          term={t('checkout:receipt.credit')}
          optional
        />
        <TotalRow
          pending={isMutatingCart}
          totals={totals}
          type={SelectionTotalRowType.Shipping}
          term={t('checkout:receipt.shipping')}
        />
        <TotalRow
          pending={isMutatingCart}
          totals={totals}
          type={SelectionTotalRowType.Handling}
          term={t('checkout:receipt.handling')}
          optional
        />
      </dl>
      <VoucherList discounts={data.discounts} />
      <dl className="text-mono-900 text-base">
        <TotalRow
          pending={isMutatingCart}
          totals={totals}
          type={SelectionTotalRowType.GrandTotal}
          term={t('checkout:receipt.grand-total')}
        />
      </dl>
    </aside>
  );
};
