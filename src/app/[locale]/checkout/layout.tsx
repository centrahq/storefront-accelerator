import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';

import { Logo } from '@/components/layout/Logo';
import { CheckoutItems } from '@/features/checkout/components/CheckoutItems';
import { CheckoutScript } from '@/features/checkout/components/CheckoutScript';
import { AdyenExpressCheckout } from '@/features/checkout/components/Payment/AdyenExpressCheckout';
import { InitiateOnlyPayments } from '@/features/checkout/components/Payment/InitiateOnlyPayments';
import { Totals } from '@/features/checkout/components/Totals/Totals';
import { checkoutQuery } from '@/features/checkout/queries';
import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getSession } from '@/lib/centra/sessionCookie';
import { getQueryClient } from '@/lib/centra/storefront-api/queryClient';

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
  const { isLoggedIn, language, market } = await getSession();
  const { lines, checkout } = await queryClient.fetchQuery(checkoutQuery);

  const hasSubscriptionItems = lines.some((line) => line?.subscriptionId != null);
  const cartTotal = checkout.totals.find((total) => total.type === 'GRAND_TOTAL')?.price.value ?? 0;
  const lineItems = lines
    .filter((line): line is NonNullable<typeof line> => line !== null)
    .map((line) => ({
      name: line.displayItem.name,
      price: line.lineValue.value.toFixed(2),
    }));

  const { t } = await getTranslation(['server', 'checkout']);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[minmax(0,calc(50%+6rem))_1fr]">
        <div>
          <div className="relative mx-auto flex max-w-fit px-10 pt-20 pb-5 lg:mr-0 lg:max-w-200 lg:justify-center">
            <div className="w-140">
              <div className="absolute top-5">
                <Link href="/" className="text-2xl">
                  <Logo />
                </Link>
              </div>
              <h1 className="text-4xl font-medium">{t('server:checkout.checkout')}</h1>
              <p className="text-mono-500 mb-10">{t('server:checkout.hint')}</p>
              {!isLoggedIn && hasSubscriptionItems ? (
                <p className="rounded border border-red-600 bg-red-50 p-4 text-sm text-red-800">
                  <Trans t={t} i18nKey="server:checkout.subscription-login-required">
                    You must
                    <ShopLink href="/login" className="underline underline-offset-2">
                      login
                    </ShopLink>
                    to checkout with subscription items.
                  </Trans>
                </p>
              ) : (
                <div className="flex flex-col gap-5">
                  <InitiateOnlyPayments />
                  {children}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-mono-0 px-10 py-5 lg:pt-20">
          <div className="sticky top-20 mx-auto flex w-100 flex-col gap-8 lg:mx-0">
            <div>
              <h2 className="text-3xl font-medium">{t('server:checkout.summary')}</h2>
              <p className="text-mono-500">{t('checkout:cart.hint')}</p>
            </div>
            <CheckoutItems />
            <Totals />
            {!hasSubscriptionItems && lineItems.length > 0 && (
              <AdyenExpressCheckout
                cartTotal={cartTotal}
                initialLineItems={lineItems}
                language={language}
                market={market}
              />
            )}
          </div>
        </div>
        {(isLoggedIn || !hasSubscriptionItems) && <CheckoutScript />}
      </div>
    </HydrationBoundary>
  );
}
