import { TrashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { useRemoveEmbroideryCheckout, useRemoveEmbroideryFromLine } from '../mutations';

export const DeleteEmbroidery = ({ lineId, inCheckout = false }: { lineId: string; inCheckout?: boolean }) => {
  const { t } = useTranslation(['shop']);
  const removeEmbroideryFromLineMutation = useRemoveEmbroideryFromLine();
  const removeEmbroideryCheckoutMutation = useRemoveEmbroideryCheckout();

  const removeEmbroideryMutation = inCheckout ? removeEmbroideryCheckoutMutation : removeEmbroideryFromLineMutation;

  return (
    <button
      type="button"
      title={t('shop:embroidery.remove')}
      onClick={() => removeEmbroideryMutation.mutate({ lineId })}
      disabled={removeEmbroideryMutation.isPending}
    >
      <TrashIcon
        className={clsx('size-4', { 'animate-spin': removeEmbroideryMutation.isPending })}
        aria-hidden="true"
      />
      <span className="sr-only">{t('shop:embroidery.remove')}</span>
    </button>
  );
};
