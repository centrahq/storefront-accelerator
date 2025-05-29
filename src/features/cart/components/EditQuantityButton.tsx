import { toast } from 'sonner';

import { useTranslation } from '@/features/i18n/useTranslation/client';
import { LineFragment } from '@gql/graphql';

import { useUpdateLine } from '../mutations';

export const EditItemQuantityButton = ({ line, type }: { line: LineFragment; type: 'increase' | 'decrease' }) => {
  const { t } = useTranslation(['shop']);
  const updateLineMutation = useUpdateLine();

  const editQuantity = () => {
    updateLineMutation.mutate(
      { id: line.id, quantity: type === 'increase' ? line.quantity + 1 : line.quantity - 1 },
      {
        onError: () => {
          toast.error(t('shop:cart.errors.update'));
        },
      },
    );
  };

  return (
    <button type="button" className="font-bold" onClick={editQuantity}>
      <span aria-hidden>{type === 'increase' ? '+' : '-'}</span>
      <span className="sr-only">{type === 'increase' ? t('shop:cart.increase') : t('shop:cart.decrease')}</span>
    </button>
  );
};
