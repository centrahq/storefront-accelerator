import { notFound } from 'next/navigation';
import { cache } from 'react';

const LOCALE_REGEX = /^(?<language>.*)-(?<country>[A-Z]{2})$/;

export const matchLocaleParam = (locale: string): { language?: string; country?: string } => {
  return locale.match(LOCALE_REGEX)?.groups ?? {};
};

export const matchLocaleParamStrict = (locale: string) => {
  const { country, language } = matchLocaleParam(locale);

  if (!language || !country) {
    notFound();
  }

  return { language, country };
};

export const serializeLocale = ({ language, country }: ReturnType<typeof matchLocaleParamStrict>) => {
  return `${language}-${country}`;
};

type ParsedParams = {
  language: string;
  country: string;
};

const $locale = Symbol('Locale');

type Cache = {
  locale: ParsedParams;
  [$locale]?: string;
};

const getCache = cache<() => Cache>(() => ({
  locale: {
    country: '',
    language: '',
  },
}));

const parse = (locale: string) => {
  const cached = getCache();

  if (!cached[$locale]) {
    cached[$locale] = locale;
    cached.locale = Object.freeze(matchLocaleParamStrict(locale));
  } else if (cached[$locale] !== locale) {
    throw new Error('Cannot parse different locales in the same request');
  }

  return cached.locale;
};

/**
 * A utility for parsing and getting the locale from the URL.
 * `localeParams.parse()` must be called at the beginning of each request to parse the locale.
 * Later calls to `localeParams.country` and `localeParams.language` will return the cached parsed values.
 * We get these from params to not rely on cookies or headers, which would opt the page into dynamic rendering.
 */
export const localeParam = {
  parse,
  get country() {
    return getCache().locale.country;
  },
  get language() {
    return getCache().locale.language;
  },
};
