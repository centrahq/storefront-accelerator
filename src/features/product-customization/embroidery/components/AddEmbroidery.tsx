'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { useAddEmbroideryCheckout, useAddEmbroideryToLine } from '../mutations';
import { EmbroideryPanel } from './EmbrioderyPanel';

export const AddEmbroidery = ({ lineId, inCheckout = false }: { lineId: string; inCheckout?: boolean }) => {
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
          toast.error(t('shop:embroidery.error-add'));
        },
      },
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsPanelOpen(true)}
        className="bg-mono-0 text-mono-900 border-mono-900 flex w-full items-center justify-center border px-6 py-1 text-xs font-semibold uppercase"
      >
        {t('shop:embroidery.customize')}
      </button>
      <EmbroideryPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSubmit={handleSubmit}
        ctaText={t('shop:embroidery.add-for-free')}
      />
    </>
  );
};
