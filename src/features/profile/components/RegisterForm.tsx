'use client';

import { Field, Input, Label, Select } from '@headlessui/react';
import clsx from 'clsx';
import { useActionState, useState } from 'react';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { register } from '../actions';

interface RegisterFormProps {
  defaultCountry: string;
  defaultState: string | null;
  countries: Array<{
    code: string;
    name: string;
    states?: Array<{
      name: string;
      code: string;
    }>;
  }>;
}

export const RegisterForm = ({ defaultCountry, defaultState, countries }: RegisterFormProps) => {
  const { t } = useTranslation(['shop']);
  const [country, setCountry] = useState(defaultCountry);
  const [formState, formAction, isPending] = useActionState(register, null);

  const states = countries.find(({ code }) => code === country)?.states ?? [];

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h2 className="text-4xl font-medium">{t('shop:user.register')}</h2>
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
      <div className="grid grid-cols-2 gap-5 max-xl:grid-cols-1">
        <Field className="flex flex-col gap-1">
          <Label>{t('shop:addressForm.labels.firstName')}</Label>
          <Input name="firstName" required className="border-mono-300 border px-6 py-3 text-sm" />
        </Field>
        <Field className="flex flex-col gap-1">
          <Label>{t('shop:addressForm.labels.lastName')}</Label>
          <Input name="lastName" required className="border-mono-300 border px-6 py-3 text-sm" />
        </Field>
        <Field className="flex flex-col gap-1">
          <Label>{t('shop:addressForm.labels.country')}</Label>
          <Select
            className="border-mono-300 border px-6 py-3 text-sm"
            name="country"
            value={country}
            onChange={(evt) => setCountry(evt.target.value)}
            required
          >
            <option value="">{t('shop:addressForm.placeholders.select-country')}</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </Select>
        </Field>
        {states.length > 0 && (
          <Field className="flex flex-col gap-1">
            <Label>{t('shop:addressForm.labels.state')}</Label>
            <Select
              className="border-mono-300 border px-6 py-3 text-sm"
              name="state"
              defaultValue={defaultState ?? ''}
              required
            >
              <option value="">{t('shop:addressForm.placeholders.select-state')}</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </Select>
          </Field>
        )}
      </div>
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
        {t('shop:user.register')}
      </button>
    </form>
  );
};
