'use client';

import { CloseButton, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useIsMutating, useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';

import { Trans } from '@/features/i18n';
import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { useTranslation } from '@/features/i18n/useTranslation/client';

import { selectionQuery } from '../../queries';
import { CartContext } from '../CartContext';
import { CartItems } from '../CartItems';

export const CartPanel = () => {
  const { t } = useTranslation(['shop']);
  const { data } = useSuspenseQuery(selectionQuery);
  const isMutatingSelection = useIsMutating({ mutationKey: ['selection'] }) > 0;

  const { grandTotal, lines } = data;
  const { isCartOpen, setIsCartOpen } = useContext(CartContext);

  const totalQuantity = useMemo(() => {
    return lines.reduce((acc, line) => acc + (line?.quantity ?? 0), 0);
  }, [lines]);

  const totalValue = useMemo(() => {
    const value = lines.reduce((acc, line) => acc + (line?.lineValue.value ?? 0), 0);
    const currency = grandTotal.currency;

    return [currency.prefix, value, currency.suffix].filter((val) => val !== '' && val !== null).join(' ');
  }, [lines, grandTotal.currency]);

  return (
    <>
      <div className="relative">
        <button type="button" onClick={() => setIsCartOpen(true)} className="flex items-center justify-center">
          <ShoppingBagIcon className="size-6" />
          <span className="sr-only">{t('shop:cart.open')}</span>
        </button>
        {totalQuantity > 0 && (
          <p className="bg-mono-800 pointer-events-none absolute -top-1 left-1/2 flex h-4 min-w-4 items-center justify-center rounded-full px-1">
            <Trans i18nKey="shop:cart.hint" t={t} values={{ totalQuantity }}>
              <span className="sr-only">Total items in the cart:</span>
              <span className="text-mono-0 text-xs">?</span>
            </Trans>
          </p>
        )}
      </div>
      <Dialog open={isCartOpen} onClose={() => setIsCartOpen(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/70 backdrop-blur-xs duration-300 ease-out data-closed:bg-transparent data-closed:backdrop-blur-none"
        />
        <DialogPanel
          transition
          className="bg-mono-0 fixed inset-y-0 right-0 size-full translate-x-0 overflow-auto duration-300 ease-out data-closed:translate-x-full md:w-[30rem]"
        >
          <CloseButton className="absolute top-4 right-4">
            <XMarkIcon className="size-6" />
            <span className="sr-only">{t('shop:common.close')}</span>
          </CloseButton>
          <div className="flex flex-col gap-5 p-10 pb-0">
            <div>
              <DialogTitle className="text-3xl font-medium">{t('shop:cart.title')}</DialogTitle>
              <p className="text-mono-500">{t('shop:cart.review')}</p>
            </div>
            <CartItems />
            <div className="bg-mono-0 sticky bottom-0 flex flex-col gap-5 pb-10">
              <dl>
                <div className="flex justify-between font-medium">
                  <dt>{t('shop:cart.total')}</dt>
                  <dd>{isMutatingSelection ? '...' : totalValue}</dd>
                </div>
              </dl>
              <ShopLink
                href="/checkout"
                className="bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase"
                type="submit"
              >
                {t('shop:cart.proceed')}
              </ShopLink>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};
