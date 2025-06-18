'use server';

import { cookies } from 'next/headers';

import { serializeLocale } from '@/features/i18n/routing/localeParam';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { apiTokenCookie } from '@/lib/centra/cookies';
import { centraFetch } from '@/lib/centra/dtc-api/fetchers/session';
import { createSessionCookie, mapSession } from '@/lib/centra/sessionCookie';
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

    const hasRemovedItems = response.data.setCountryState.userErrors.some(
      (error) => error.__typename === 'UnavailableItem',
    );

    return {
      status: 'success' as const,
      locale: serializeLocale(session),
      hasRemovedItems,
    };
  } catch {
    return { status: 'error' as const, message: t('server:something-went-wrong') };
  }
}
