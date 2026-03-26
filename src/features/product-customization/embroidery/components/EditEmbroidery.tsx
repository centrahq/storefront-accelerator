'use client';

import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { useAddEmbroideryCheckout, useAddEmbroideryToLine } from '../mutations';
import { EmbroideryPanel } from './EmbrioderyPanel';

export const EditEmbroidery = ({
  lineId,
  currentText,
  inCheckout = false,
}: {
  lineId: string;
  currentText: string;
  inCheckout?: boolean;
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { t } = useTranslation(['shop']);
  const addEmbroideryToLineMutation = useAddEmbroideryToLine();
  const addEmbroideryCheckoutMutation = useAddEmbroideryCheckout();

  const addEmbroideryMutation = inCheckout ? addEmbroideryCheckoutMutation : addEmbroideryToLineMutation;

  const handleSubmit = (text: string) => {
    addEmbroideryMutation.mutate(
      { lineId, text },
      {
        onSuccess: () => {
          setIsPanelOpen(false);
        },
        onError: () => {
          toast.error(t('shop:embroidery.error-change'));
        },
      },
    );
  };

  return (
    <>
      <button type="button" title={t('shop:embroidery.edit')} onClick={() => setIsPanelOpen(true)}>
        <PencilSquareIcon className="size-4" aria-hidden="true" />
        <span className="sr-only">{t('shop:embroidery.edit')}</span>
      </button>
      <EmbroideryPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSubmit={handleSubmit}
        initialText={currentText}
        ctaText={t('shop:embroidery.change')}
      />
    </>
  );
};
