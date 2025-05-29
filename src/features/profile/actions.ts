'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { serializeLocale } from '@/features/i18n/routing/localeParam';
import { DEFAULT_LANGUAGE } from '@/features/i18n/settings';
import { getTranslation } from '@/features/i18n/useTranslation/server';
import { apiTokenCookie, sessionCookie } from '@/lib/centra/cookies';
import { centraFetch } from '@/lib/centra/dtc-api/fetchers/session';
import { UserError } from '@/lib/centra/errors';
import { createSessionCookie, getSession } from '@/lib/centra/sessionCookie';
import { graphql } from '@gql/gql';

export async function login(_prevState: unknown, formData: FormData) {
  const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
  });

  const cookieStore = await cookies();
  const { language } = await getSession();

  const parsedInput = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsedInput.success) {
    const { t } = await getTranslation(['server'], language);

    return { error: t('server:user.errors.required-fields') };
  }

  const headersList = await headers();
  let locale: string;

  try {
    const response = await centraFetch(
      graphql(`
        mutation login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            session {
              ...session
            }
            userErrors {
              message
              path
            }
          }
        }
      `),
      {
        variables: parsedInput.data,
        headers: {
          'x-forwarded-for': (headersList.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0] ?? '',
        },
      },
    );

    if (response.data.login.userErrors.length > 0) {
      throw new UserError(response.data.login.userErrors, response.extensions.traceId);
    }

    cookieStore.set(apiTokenCookie.name, response.extensions.token);
    locale = serializeLocale({
      country: response.data.login.session.country.code,
      language: response.data.login.session.language?.code ?? DEFAULT_LANGUAGE.code,
    });
    cookieStore.set(createSessionCookie(response.data.login.session));
  } catch {
    const { t } = await getTranslation(['server'], language);

    return { error: t('server:user.errors.invalid-login') };
  }

  redirect(`/${locale}`);
}

export async function register(_prevState: unknown, formData: FormData) {
  const registerSchema = z.object({
    billingAddress: z.object({
      firstName: z.string(),
      lastName: z.string(),
      country: z.string(),
      state: z.string().nullable().optional(),
      email: z.string(),
    }),
    password: z.string().min(8),
  });

  const cookieStore = await cookies();
  const session = await getSession();

  const parsedInput = registerSchema.safeParse({
    billingAddress: {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      country: formData.get('country'),
      state: formData.get('state'),
      email: formData.get('email'),
    },
    password: formData.get('password'),
  });

  if (parsedInput.error) {
    const { t } = await getTranslation(['server'], session.language);

    return { error: t('server:user.errors.required-fields') };
  }

  try {
    const response = await centraFetch(
      graphql(`
        mutation register($input: CustomerRegisterInput!) {
          registerCustomer(input: $input) {
            userErrors {
              message
              path
            }
          }
        }
      `),
      {
        variables: {
          input: {
            ...parsedInput.data,
            loginOnSuccess: true,
          },
        },
      },
    );

    if (response.data.registerCustomer.userErrors.length > 0) {
      throw new UserError(response.data.registerCustomer.userErrors, response.extensions.traceId);
    }

    cookieStore.set({
      ...apiTokenCookie,
      value: response.extensions.token,
    });
    cookieStore.delete(sessionCookie.name);
  } catch {
    const { t } = await getTranslation(['server'], session.language);

    return { error: t('server:user.errors.invalid-register') };
  }

  redirect(`/${serializeLocale(session)}`);
}

export const logout = async () => {
  const cookieStore = await cookies();
  const headersList = await headers();
  let locale = serializeLocale(await getSession());

  try {
    const response = await centraFetch(
      graphql(`
        mutation logout {
          logout {
            session {
              ...session
            }
          }
        }
      `),
      {
        headers: {
          'x-forwarded-for': (headersList.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0] ?? '',
        },
      },
    );

    cookieStore.set({
      ...apiTokenCookie,
      value: response.extensions.token,
    });

    const sessionData = response.data.logout?.session;

    if (!sessionData) {
      throw new Error('No session data found');
    }

    cookieStore.set(createSessionCookie(sessionData));
    locale = serializeLocale({
      country: sessionData.country.code,
      language: sessionData.language?.code ?? DEFAULT_LANGUAGE.code,
    });
  } catch {
    cookieStore.delete(sessionCookie.name);
  }

  redirect(`/${locale}`);
};

export async function forgotPassword(_prevState: unknown, formData: FormData) {
  const forgotPasswordSchema = z.object({
    email: z.string(),
  });

  const session = await getSession();
  const { t } = await getTranslation(['server'], session.language);

  const parsedInput = forgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (parsedInput.error) {
    return { error: t('server:user.errors.required-fields') };
  }

  try {
    await centraFetch(
      graphql(`
        mutation forgotPassword($email: String!, $uri: String!) {
          requestPasswordResetEmail(email: $email, resetPasswordExternalUrl: $uri) {
            userErrors {
              message
              path
            }
          }
        }
      `),
      {
        variables: {
          email: parsedInput.data.email,
          // Base url is set in DTC API plugin's "Frontend URL" field
          uri: `${serializeLocale(session)}/reset-password`,
        },
      },
    );
  } catch {}

  return { message: t('server:user.reset-password.email-sent', { email: parsedInput.data.email }) };
}

export async function resetPassword(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  const { t } = await getTranslation(['server'], session.language);

  const resetPasswordSchema = z
    .object({
      password: z.string({ message: t('server:user.errors.required-fields') }),
      confirmPassword: z.string({ message: t('server:user.errors.required-fields') }),
      i: z.string({ message: t('server:user.reset-password.missing-params') }),
      id: z.string({ message: t('server:user.reset-password.missing-params') }),
    })
    .refine((data) => data.password === data.confirmPassword, t('server:user.reset-password.passwords-match'));

  const parsedInput = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
    i: formData.get('i'),
    id: formData.get('id'),
  });

  if (!parsedInput.success) {
    return { error: parsedInput.error.errors[0]?.message };
  }

  try {
    const response = await centraFetch(
      graphql(`
        mutation resetPassword($password: String!, $confirmPassword: String!, $i: String!, $id: String!) {
          resetPassword(password: $password, confirmPassword: $confirmPassword, i: $i, id: $id) {
            userErrors {
              message
              path
            }
          }
        }
      `),
      {
        variables: parsedInput.data,
      },
    );

    if (response.data.resetPassword.userErrors.length > 0) {
      throw new UserError(response.data.resetPassword.userErrors, response.extensions.traceId);
    }
  } catch {
    return { error: t('server:user.reset-password.something-went-wrong') };
  }

  return { message: t('server:user.reset-password.password-changed') };
}
