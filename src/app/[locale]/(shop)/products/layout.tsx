import { ReactNode } from 'react';

import { localeParam } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';

export default async function ProductsLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactNode;
}) {
  localeParam.parse((await params).locale);
  const { t } = await getTranslation(['server']);

  return (
    <>
      <title>{t('server:products.title')}</title>
      <div className="flex flex-col gap-6 sm:gap-10">
        <h1 className="text-4xl font-medium">{t('server:products.title')}</h1>
        {children}
      </div>
    </>
  );
}
