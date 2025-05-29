import { createInstance, Namespace } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { cache } from 'react';
import { initReactI18next } from 'react-i18next/initReactI18next';

import { localeParam } from '../routing/localeParam';
import { getOptions } from '../settings';

const initI18next = cache(async (lng: string, ...ns: string[]) => {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend((language: string, namespace: string) => import(`../locales/${language}/${namespace}.json`)),
    )
    .init(getOptions(lng, ns));

  return i18nInstance;
});

export const getTranslation = async <Ns extends Namespace>(ns: Ns, lang?: string) => {
  const language = lang ?? localeParam.language;

  if (!language) {
    throw new Error(
      'No language provided, run `localeParam.parse(locale)` in pages or provide a language in server actions',
    );
  }

  const namespaces = [ns].flat();
  const i18nextInstance = await initI18next(language, ...namespaces);

  return {
    t: i18nextInstance.getFixedT(language, ns),
    i18n: i18nextInstance,
  };
};
