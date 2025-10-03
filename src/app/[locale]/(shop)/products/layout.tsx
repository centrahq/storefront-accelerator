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

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-6 sm:gap-10">{children}</div>;
}
