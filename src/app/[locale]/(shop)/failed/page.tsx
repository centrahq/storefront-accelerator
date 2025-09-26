import { Metadata } from 'next';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { getTranslation } from '@/features/i18n/useTranslation/server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation(['server']);

  return {
    title: t('server:checkout.failed'),
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function Failed() {
  const { t } = await getTranslation(['server']);

  return (
    <div className="flex grow flex-col items-center justify-center gap-8 self-center">
      <h1 className="text-4xl font-medium">{t('server:checkout.failed')}</h1>
      <p className="text-xl">{t('server:checkout.generic-failure')}</p>
      <ShopLink href="/checkout" className="underline">
        {t('server:checkout.back-to-checkout')}
      </ShopLink>
    </div>
  );
}
