'use server';

import { cookies } from 'next/headers';

import { serializeLocale } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { apiTokenCookie } from '@/lib/centra/cookies';
import { createSessionCookie, mapSession } from '@/lib/centra/sessionCookie';
import { centraFetch } from '@/lib/centra/storefront-api/fetchers/session';
import { checkUnavailableItems } from '@/lib/utils/unavailableItems';
import { graphql } from '@gql/gql';

export async function changeLocale({ country, language }: { country: string; language: string }) {
  const cookieStore = await cookies();

  const { t } = await getTranslation(['server']);

  try {
    const response = await centraFetch(
      graphql(`
        mutation changeLocale($country: String!, $language: String!) {
          setCountryState(countryCode: $country) {
            userErrors {
              __typename
              message
              path
            }
          }
          setLanguage(code: $language) {
            session {
              ...session
            }
          }
        }
      `),
      {
        variables: {
          country,
          language,
        },
      },
    );

    cookieStore.set(apiTokenCookie.name, response.extensions.token);
    const session = mapSession(response.data.setLanguage.session);
    cookieStore.set(await createSessionCookie(session));

    return {
      status: 'success' as const,
      locale: serializeLocale(session),
      /* 
        It is possible that some items in the cart are not available in the new selected country.
        In this case, the `UnavailableItem` error is returned, and we should notify the user.
      */
      hasRemovedItems: checkUnavailableItems(response.data.setCountryState.userErrors),
    };
  } catch {
    return { status: 'error' as const, message: t('server:something-went-wrong') };
  }
}
