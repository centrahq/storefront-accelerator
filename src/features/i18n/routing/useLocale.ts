import { useParams } from 'next/navigation';

import { parseLocale } from './localeParam';

export const useLocale = () => {
  const params = useParams<{ locale: string }>();

  const { country, language } = parseLocale(params.locale);

  if (!country || !language) {
    throw new Error('Locale parameters are missing or invalid');
  }

  return { country, language };
};
