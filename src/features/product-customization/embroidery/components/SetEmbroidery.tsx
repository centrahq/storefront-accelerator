'use client';

import { PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { EmbroideryPanel } from './EmbrioderyPanel';
import { useEmbroidery } from './EmbroideryContext';

export const SetEmbroidery = () => {
  const { embroideryText, setEmbroideryText } = useEmbroidery();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { t } = useTranslation(['shop']);

  const handleSubmit = (text: string) => {
    setEmbroideryText(text);
    setIsPanelOpen(false);
  };

  return (
    <>
      {embroideryText ? (
        <div className="text-mono-800 border-mono-300 flex items-center gap-2 rounded-sm border p-4">
          <span>{t('shop:embroidery.text-with-value', { text: embroideryText })}</span>
          <button type="button" onClick={() => setEmbroideryText('')}>
            <XMarkIcon className="size-5" aria-hidden="true" />
            <span className="sr-only">{t('shop:embroidery.remove')}</span>
          </button>
          <button type="button" onClick={() => setIsPanelOpen(true)} title={t('shop:embroidery.edit-customization')}>
            <PencilSquareIcon className="size-5" aria-hidden="true" />
            <span className="sr-only">{t('shop:embroidery.edit-customization')}</span>
          </button>
          <span className="ml-auto">{t('shop:embroidery.free')}</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsPanelOpen(true)}
          className="bg-mono-0 text-mono-900 border-mono-900 flex w-full items-center justify-center border px-6 py-4 text-xs font-bold uppercase sm:max-w-xs"
        >
          {t('shop:embroidery.customize')}
        </button>
      )}
      <EmbroideryPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSubmit={handleSubmit}
        initialText={embroideryText}
        ctaText={t('shop:embroidery.add-for-free')}
      />
    </>
  );
};
