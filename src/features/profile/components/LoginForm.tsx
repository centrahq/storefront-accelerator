'use client';

import { Field, Input, Label } from '@headlessui/react';
import clsx from 'clsx';
import { useActionState } from 'react';

import { ShopLink } from '@/features/i18n/routing/ShopLink';
import { useTranslation } from '@/features/i18n/useTranslation/client';

import { login } from '../actions';

export const LoginForm = () => {
  const { t } = useTranslation(['shop']);
  const [formState, formAction, isPending] = useActionState(login, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h2 className="text-4xl font-medium">{t('shop:user.login')}</h2>
      {formState?.error && (
        <p
          aria-live="polite"
          role="status"
          className="rounded border border-red-600 bg-red-50 p-4 text-sm text-red-800"
        >
          {formState.error}
        </p>
      )}
      <Field className="flex flex-col gap-1">
        <Label>{t('shop:user.email')}</Label>
        <Input type="email" name="email" required className="border-mono-300 border px-6 py-3 text-sm" />
      </Field>
      <Field className="flex flex-col gap-1">
        <div className="flex flex-row items-baseline justify-between">
          <Label>{t('shop:user.password')}</Label>
          <ShopLink href="/forgot-password" className="text-mono-500 text-sm underline">
            {t('shop:user.forgot-password')}
          </ShopLink>
        </div>
        <Input type="password" name="password" required className="border-mono-300 border px-6 py-3 text-sm" />
      </Field>
      <button
        type="submit"
        disabled={isPending}
        className={clsx(
          'bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase',
          {
            'animate-pulse': isPending,
          },
        )}
      >
        {t('shop:user.login')}
      </button>
    </form>
  );
};
