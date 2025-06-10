'use client';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { useTranslation } from '@/features/i18n/useTranslation/client';

export default function NotFoundPage() {
  const { t } = useTranslation(['shop']);

  return (
    <div className="flex grow flex-col items-center justify-center gap-8 self-center">
      <h1 className="text-4xl font-medium">{t('shop:page-not-found.title')}</h1>
      <p className="text-xl">{t('shop:page-not-found.hint')}</p>
      <ShopLink href="/" className="underline">
        {t('shop:back-to-home')}
      </ShopLink>
    </div>
  );
}
