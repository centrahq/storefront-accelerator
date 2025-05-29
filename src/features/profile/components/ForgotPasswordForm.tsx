'use client';

import { Field, Input, Label } from '@headlessui/react';
import clsx from 'clsx';
import { useActionState } from 'react';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { forgotPassword } from '../actions';

export const ForgotPasswordForm = () => {
  const { t } = useTranslation(['shop']);
  const [formState, formAction, isPending] = useActionState(forgotPassword, null);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <h2 className="text-4xl font-medium">{t('shop:user.reset-password.enter-email')}</h2>
      {formState?.error && (
        <p
          aria-live="polite"
          role="status"
          className="rounded border border-red-600 bg-red-50 p-4 text-sm text-red-800"
        >
          {formState.error}
        </p>
      )}
      {formState?.message && (
        <p
          aria-live="polite"
          role="status"
          className="rounded border border-green-600 bg-green-50 p-4 text-sm text-green-800"
        >
          <span className="font-medium">{formState.message}</span>
        </p>
      )}
      <Field className="flex flex-col gap-1">
        <Label>{t('shop:user.email')}</Label>
        <Input type="email" name="email" required className="border-mono-300 border px-6 py-3 text-sm" />
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
        {t('shop:user.reset-password.reset-password')}
      </button>
    </form>
  );
};
