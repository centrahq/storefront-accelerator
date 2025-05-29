import clsx from 'clsx';
import { toast } from 'sonner';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { useRemoveVoucher } from '../../mutations';

export const RemoveVoucherButton = ({ code }: { code: string }) => {
  const { t } = useTranslation(['checkout']);
  const removeVoucherMutation = useRemoveVoucher();

  const removeVoucher = () => {
    removeVoucherMutation.mutate(code, {
      onError: () => {
        toast.error(t('checkout:errors.remove-voucher'));
      },
    });
  };

  return (
    <button
      type="button"
      onClick={removeVoucher}
      disabled={removeVoucherMutation.isPending}
      className={clsx('text-xs underline', {
        'animate-pulse': removeVoucherMutation.isPending,
      })}
    >
      {t('checkout:voucher.remove')}
    </button>
  );
};
