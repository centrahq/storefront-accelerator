'use client';

import { Field, Input, Label } from '@headlessui/react';
import clsx from 'clsx';
import { useActionState } from 'react';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { resetPassword } from '../actions';

export const ResetPasswordForm = ({ i, id }: { i: string; id: string }) => {
  const { t } = useTranslation(['shop']);
  const [formState, formAction, isPending] = useActionState(resetPassword, null);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <h2 className="text-4xl font-medium">{t('shop:user.reset-password.enter-password')}</h2>
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
        <Label>{t('shop:user.password')}</Label>
        <Input
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="border-mono-300 border px-6 py-3 text-sm"
        />
      </Field>
      <Field className="flex flex-col gap-1">
        <Label>{t('shop:user.confirm-password')}</Label>
        <Input
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          minLength={8}
          required
          className="border-mono-300 border px-6 py-3 text-sm"
        />
      </Field>
      <input type="hidden" name="i" value={i} />
      <input type="hidden" name="id" value={id} />
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
        {t('shop:user.reset-password.change-password')}
      </button>
    </form>
  );
};
