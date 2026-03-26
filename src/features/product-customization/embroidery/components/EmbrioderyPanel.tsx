import { CloseButton, Dialog, DialogBackdrop, DialogPanel, DialogTitle, Field, Input, Label } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { MAX_EMBROIDERY_TEXT_LENGTH } from '../constants';

export const EmbroideryPanel = ({
  isOpen,
  onClose,
  onSubmit,
  initialText = '',
  ctaText,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  initialText?: string;
  ctaText: string;
}) => {
  const [currentText, setCurrentText] = useState(initialText);
  const { t } = useTranslation(['shop']);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(currentText);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-200">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/70 backdrop-blur-xs duration-300 ease-out data-closed:bg-transparent data-closed:backdrop-blur-none"
      />
      <DialogPanel
        transition
        className="bg-mono-0 fixed inset-y-0 right-0 size-full translate-x-0 overflow-auto duration-300 ease-out data-closed:translate-x-full md:w-120"
      >
        <CloseButton className="absolute top-4 right-4">
          <XMarkIcon className="size-6" aria-hidden="true" />
          <span className="sr-only">{t('shop:common.close')}</span>
        </CloseButton>
        <div className="flex flex-col gap-5 p-10 pb-0">
          <div>
            <DialogTitle className="text-3xl font-medium">{t('shop:embroidery.customize')}</DialogTitle>
            <p className="text-mono-500">{t('shop:embroidery.description')}</p>
          </div>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Field className="relative flex flex-col gap-1">
              <Label>{t('shop:embroidery.text-label')}</Label>
              <Input
                className="border-mono-300 border px-6 py-3 text-sm"
                maxLength={MAX_EMBROIDERY_TEXT_LENGTH}
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
              />
            </Field>
            <button
              type="submit"
              className="bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase"
            >
              {ctaText}
            </button>
          </form>
        </div>
      </DialogPanel>
    </Dialog>
  );
};
