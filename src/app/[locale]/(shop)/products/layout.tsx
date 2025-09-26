import { Metadata } from 'next';
import { ReactNode } from 'react';

import { getTranslation } from '@/features/i18n/useTranslation/server';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation(['server']);

  return {
    title: t('server:products.title'),
    robots: {
      index: false,
      follow: true,
      nocache: true,
    },
  };
}

export default async function ProductsLayout({ children }: { children: ReactNode }) {
  const { t } = await getTranslation(['server']);

  return (
    <div className="flex flex-col gap-6 sm:gap-10">
      <h1 className="text-4xl font-medium">{t('server:products.title')}</h1>
      {children}
    </div>
  );
}
