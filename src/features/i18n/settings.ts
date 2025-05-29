import { InitOptions } from 'i18next';

export const LANGUAGES = ['en', 'sv'] as const;
export const DEFAULT_LANGUAGE = {
  code: 'en', // Name in centra
  languageCode: 'en', // ISO-639
} as const;

export const getOptions = (lng: string = DEFAULT_LANGUAGE.code, ns: InitOptions['ns'] = []): InitOptions => {
  return {
    supportedLngs: LANGUAGES,
    fallbackLng: DEFAULT_LANGUAGE.code,
    lng,
    defaultNS: [],
    ns,
  };
};
