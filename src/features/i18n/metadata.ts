import { Metadata } from 'next';

import { getCountries, getLanguages } from '@/lib/centra/storefront-api/fetchers/noSession';

import { DEFAULT_LANGUAGE } from './settings';

/**
 * Generates alternate URLs for all languages and regions.
 *
 * @example
 * // Simple static path
 * generateAlternates('/login')
 *
 * @example
 * // Dynamic path
 * generateAlternates(lang => `/product/${products[lang]}`)
 */
export const generateAlternates = async (
  path: string | ((lang: string) => string),
): Promise<NonNullable<Metadata['alternates']>['languages']> => {
  const [countries, languages] = await Promise.all([getCountries(), getLanguages()]);

  const getPath = typeof path === 'function' ? path : () => path;

  const languageAlternates = languages.reduce<Record<string, string>>((acc, language) => {
    if (language.languageCode && language.countryCode) {
      acc[language.languageCode] = `/${language.code}-${language.countryCode}${getPath(language.code)}`;
    }

    return acc;
  }, {});

  const regionalAlternates = countries.reduce<Record<string, string>>((acc, country) => {
    const language = country.defaultLanguage;

    if (language?.languageCode) {
      acc[`${language.languageCode}-${country.code}`] = `/${language.code}-${country.code}${getPath(language.code)}`;
    }

    if (language?.languageCode !== DEFAULT_LANGUAGE.languageCode) {
      acc[`${DEFAULT_LANGUAGE.languageCode}-${country.code}`] =
        `/${DEFAULT_LANGUAGE.code}-${country.code}${getPath(DEFAULT_LANGUAGE.code)}`;
    }

    return acc;
  }, {});

  return {
    ...regionalAlternates,
    ...languageAlternates,
  };
};
