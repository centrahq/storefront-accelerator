import { toast } from 'sonner';

import { useTranslation } from '@/features/i18n/useTranslation/client';
import { LineFragment } from '@gql/graphql';

import { useUpdateLine } from '../mutations';

export const DeleteItemButton = ({ line }: { line: LineFragment }) => {
  const { t } = useTranslation(['shop']);
  const updateLineMutation = useUpdateLine();

  const deleteItem = () => {
    updateLineMutation.mutate(
      { id: line.id, quantity: 0 },
      {
        onError: () => {
          toast.error(t('shop:cart.errors.delete'));
        },
      },
    );
  };

  return (
    <button type="button" onClick={deleteItem} className="text-xs font-medium underline">
      {t('shop:cart.delete')}
    </button>
  );
};
