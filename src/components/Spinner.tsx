'use client';

import clsx from 'clsx';

import { useTranslation } from '@/features/i18n/useTranslation/client';

export const Spinner = ({ className }: { className?: string }) => {
  const { t } = useTranslation(['shop']);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx('animate-spin', className)}
    >
      <title>{t('shop:loading')}</title>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
