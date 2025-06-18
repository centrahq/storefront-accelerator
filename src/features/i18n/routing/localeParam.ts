const LOCALE_REGEX = /^(?<language>.*)-(?<country>[A-Z]{2})$/;

export const parseLocale = (locale: string): { language?: string; country?: string } => {
  return locale.match(LOCALE_REGEX)?.groups ?? {};
};

export const serializeLocale = ({ language, country }: { language: string; country: string }) => {
  return `${language}-${country}`;
};
