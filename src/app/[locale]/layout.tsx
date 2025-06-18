import '../globals.css';

import clsx from 'clsx';
import i18next from 'i18next';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';

import { ItemsRemovedToast } from '@/components/ItemsRemovedToast';
import { parseLocale } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { getLanguages } from '@/lib/centra/dtc-api/fetchers/noSession';

import { Providers } from './providers';

const deployedUrl =
  process.env.VERCEL_ENV === 'preview'
    ? process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation(['server']);

  return {
    metadataBase: new URL(deployedUrl ? `https://${deployedUrl}` : `http://localhost:${process.env.PORT || 3000}`),
    title: {
      template: '%s | Centra',
      default: 'Centra',
    },
    description: t('server:meta-description'),
  };
}

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout(props: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const languages = await getLanguages();
  const { language } = parseLocale((await props.params).locale);

  const languageCode = languages.find((lang) => lang.code === language)?.languageCode;

  if (!languageCode) {
    notFound();
  }

  return (
    <html lang={languageCode} dir={i18next.dir(languageCode)}>
      <body className={clsx(inter.className, 'text-mono-900')}>
        <Providers>{props.children}</Providers>
        <Toaster />
        <ItemsRemovedToast />
      </body>
    </html>
  );
}
