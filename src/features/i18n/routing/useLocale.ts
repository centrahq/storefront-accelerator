import { useParams } from 'next/navigation';

import { matchLocaleParamStrict } from './localeParam';

export const useLocale = () => {
  const params = useParams<{ locale: string }>();

  return matchLocaleParamStrict(params.locale);
};
