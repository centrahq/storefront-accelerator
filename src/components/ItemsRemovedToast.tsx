'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import { Translation } from '@/features/i18n';

export const REMOVED_ITEMS_PARAM = 'removedItems';

export const ItemsRemovedToast = () => {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has(REMOVED_ITEMS_PARAM)) {
      toast.warning(<Translation>{(t) => t('shop:items-removed.title')}</Translation>, {
        id: 'removed-items',
        duration: Infinity,
        closeButton: true,
        onDismiss: () => {
          const url = new URL(window.location.href);
          url.searchParams.delete(REMOVED_ITEMS_PARAM);
          window.history.replaceState(null, '', url.href);
        },
        description: <Translation>{(t) => t('shop:items-removed.message')}</Translation>,
      });
    }
  }, []);

  return null;
};
