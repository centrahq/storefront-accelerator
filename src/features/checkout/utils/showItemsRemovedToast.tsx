import { toast } from 'sonner';

import { Translation } from '@/features/i18n';

export const showItemsRemovedToast = () => {
  toast.error(<Translation>{(t) => t('checkout:errors.unavailable-items.title')}</Translation>, {
    id: 'payment-error',
    duration: Infinity,
    closeButton: true,
    description: <Translation>{(t) => t('checkout:errors.unavailable-items.message')}</Translation>,
  });
};
