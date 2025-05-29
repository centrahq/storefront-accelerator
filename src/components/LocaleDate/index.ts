'use client';

import dynamic from 'next/dynamic';

export const LocaleDate = dynamic(
  () => {
    return import('./LocaleDate').then((module) => module.LocaleDate);
  },
  { ssr: false },
);
