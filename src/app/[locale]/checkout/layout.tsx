import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

import { Logo } from '@/components/layout/Logo';
import { CartItems } from '@/features/cart/components/CartItems';
import { selectionQuery } from '@/features/cart/queries';
import { CheckoutScript } from '@/features/checkout/components/CheckoutScript';
import { Totals } from '@/features/checkout/components/Totals/Totals';
import { checkoutQuery } from '@/features/checkout/queries';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getQueryClient } from '@/lib/centra/dtc-api/queryClient';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const dynamic = 'force-dynamic';

export default async function CheckoutLayout({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  await Promise.all([queryClient.prefetchQuery(selectionQuery), queryClient.prefetchQuery(checkoutQuery)]);

  const { t } = await getTranslation(['server', 'checkout']);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[minmax(0,calc(50%+6rem))_1fr]">
        <div>
          <div className="relative mx-auto flex max-w-fit px-10 pt-20 pb-5 lg:mr-0 lg:max-w-[50rem] lg:justify-center">
            <div className="w-[35rem]">
              <div className="absolute top-5">
                <Link href="/" className="text-2xl">
                  <Logo />
                </Link>
              </div>
              <h1 className="text-4xl font-medium">{t('server:checkout.checkout')}</h1>
              <p className="text-mono-500 mb-10">{t('server:checkout.hint')}</p>
              <div className="flex flex-col gap-5">{children}</div>
            </div>
          </div>
        </div>
        <div className="bg-mono-0 px-10 py-5 lg:pt-20">
          <div className="sticky top-20 mx-auto flex w-[25rem] flex-col gap-8 lg:mx-0">
            <div>
              <h2 className="text-3xl font-medium">{t('server:checkout.summary')}</h2>
              <p className="text-mono-500">{t('checkout:cart.hint')}</p>
            </div>
            <CartItems />
            <Totals />
          </div>
        </div>
        <CheckoutScript />
      </div>
    </HydrationBoundary>
  );
}
