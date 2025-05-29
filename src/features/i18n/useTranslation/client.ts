'use client';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useEffect, useSyncExternalStore } from 'react';
import { initReactI18next, useTranslation as useTranslationOrig } from 'react-i18next';

import { useLocale } from '../routing/useLocale';
import { getOptions, LANGUAGES } from '../settings';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      if (namespace !== 'server') {
        return import(`../locales/${language}/${namespace}.json`);
      }

      if (process.env.NODE_ENV === 'development') {
        console.error('Server namespace can not be used on client side');
      }
    }),
  )
  .init({
    ...getOptions(),
    lng: undefined,
    detection: {
      order: ['htmlTag', 'path'],
    },
    preload: typeof window === 'undefined' ? LANGUAGES : [],
  })
  .catch(console.error);

export const useTranslation: typeof useTranslationOrig = (ns, options) => {
  const { language } = useLocale();
  const returnValue = useTranslationOrig(ns, options);
  const { i18n } = returnValue;

  if (typeof window === 'undefined' && i18n.resolvedLanguage !== language) {
    i18n.changeLanguage(language).catch(console.error);
  }

  // Trigger re-render when language changes
  useSyncExternalStore(
    (callback) => {
      i18n.on('languageChanged', callback);

      return () => i18n.off('languageChanged', callback);
    },
    () => i18n.resolvedLanguage ?? language,
    () => language,
  );

  useEffect(() => {
    if (language && i18n.resolvedLanguage !== language) {
      i18n.changeLanguage(language).catch(console.error);
    }
  }, [i18n, language]);

  return returnValue;
};
