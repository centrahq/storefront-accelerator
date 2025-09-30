'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Form from 'next/form';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { useTranslation } from '@/features/i18n/useTranslation/client';

interface SearchButtonProps {
  withLabel?: boolean;
  withBackground?: boolean;
}

export const SearchButton = ({ withLabel = false, withBackground = false }: SearchButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(['shop']);
  const inputRef = useRef<HTMLInputElement>(null);
  const params = useParams<{ locale: string }>();

  const openSearch = () => {
    flushSync(() => {
      setIsOpen(true);
    });

    inputRef.current?.focus();
  };

  if (!isOpen) {
    return (
      <button type="button" onClick={openSearch} className="flex items-center gap-2">
        <MagnifyingGlassIcon className="size-6" aria-hidden="true" />
        <span className={clsx('py-2', { 'sr-only': !withLabel })}>{t('shop:filters.search')}</span>
      </button>
    );
  }

  return (
    <Form
      role="search"
      action={`/${params.locale}/products`}
      prefetch={false}
      className={clsx(
        'absolute inset-0 z-10 flex items-center justify-between gap-2 shadow-[inset_0_-1px_0_0_currentColor]',
        {
          'bg-mono-100': withBackground,
        },
      )}
    >
      <button type="submit">
        <MagnifyingGlassIcon className="size-6" aria-hidden="true" />
        <span className="sr-only">{t('shop:filters.search')}</span>
      </button>
      <input ref={inputRef} name="q" onBlur={() => setIsOpen(false)} className="w-full bg-transparent outline-hidden" />
    </Form>
  );
};
