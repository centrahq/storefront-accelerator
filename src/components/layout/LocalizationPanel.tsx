'use client';

import { CloseButton, Dialog, DialogBackdrop, DialogPanel, DialogTitle, Field, Label, Select } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useParams, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { useLocale } from '@/features/i18n/routing/useLocale';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { REMOVED_ITEMS_PARAM } from '@/lib/utils/unavailableItems';

import { changeLocale } from './actions';

interface Props {
  countries: {
    code: string;
    name: { [language: string]: string };
  }[];
  languages: {
    code: string;
    name: string;
  }[];
}

export const LocalizationPanel = ({ countries, languages }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { country, language } = useLocale();
  const languageName = languages.find((lang) => lang.code === language)?.name ?? '?';
  const { t } = useTranslation(['shop']);
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isPending, startTransition] = useTransition();

  const languageOptions = languages
    .map((language) => ({
      value: language.code,
      label: language.name,
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label));

  const countryOptions = countries
    .map((country) => ({
      value: country.code,
      label: country.name[selectedLanguage] ?? '',
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label));

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await changeLocale({
        country: selectedCountry,
        language: selectedLanguage,
      });

      if (result.status === 'error') {
        toast.error(result.message);
        return;
      }

      // If there is an alternate, redirect to it. Otherwise replace the locale in the current URL.
      const newUrl = new URL(
        document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${result.locale}"]`)?.href ??
          location.pathname.replace(`/${locale}`, `/${result.locale}`),
        window.location.origin,
      );

      // If there are removed items due to country change, add a query parameter to the URL. So we can display a toast after redirect.
      if (result.hasRemovedItems) {
        newUrl.searchParams.set(REMOVED_ITEMS_PARAM, 'true');
      }

      router.push(newUrl.href);
    });
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>{`${languageName} / ${country}`}</button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/70 backdrop-blur-xs duration-300 ease-out data-closed:bg-transparent data-closed:backdrop-blur-none"
        />
        <DialogPanel
          transition
          className="bg-mono-0 fixed inset-y-0 right-0 size-full translate-x-0 overflow-auto duration-300 ease-out data-closed:translate-x-full md:w-[30rem]"
        >
          <CloseButton className="absolute top-4 right-4">
            <XMarkIcon className="size-6" />
            <span className="sr-only">{t('shop:common.close')}</span>
          </CloseButton>
          <form onSubmit={handleSave} className="flex flex-col gap-5 p-10">
            <div>
              <DialogTitle className="text-3xl font-medium">{t('shop:localization.title')}</DialogTitle>
              <p className="text-mono-500">{t('shop:localization.hint')}</p>
            </div>
            <Field className="flex flex-col gap-1">
              <Label>{t('shop:localization.language')}</Label>
              <Select
                value={selectedLanguage}
                onChange={(event) => setSelectedLanguage(event.currentTarget.value)}
                className="border-mono-300 bg-mono-0 text-mono-500 border px-6 py-4 text-sm"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field className="flex flex-col gap-1">
              <Label>{t('shop:localization.country')}</Label>
              <Select
                value={selectedCountry}
                onChange={(event) => setSelectedCountry(event.currentTarget.value)}
                className="border-mono-300 bg-mono-0 text-mono-500 border px-6 py-4 text-sm"
              >
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <button
              type="submit"
              disabled={isPending}
              className={clsx(
                'bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase',
                { 'animate-pulse': isPending },
              )}
            >
              {t('shop:localization.save')}
            </button>
          </form>
        </DialogPanel>
      </Dialog>
    </>
  );
};
