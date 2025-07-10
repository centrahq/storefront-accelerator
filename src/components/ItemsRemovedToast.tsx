'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Translation } from '@/features/i18n';
import { REMOVED_ITEMS_PARAM } from '@/lib/utils/unavailableItems';

export const ItemsRemovedToast = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasRemovedItems = searchParams.get(REMOVED_ITEMS_PARAM) === 'true';

  useEffect(() => {
    if (hasRemovedItems) {
      toast.warning(<Translation>{(t) => t('shop:items-removed.title')}</Translation>, {
        id: 'removed-items',
        duration: Infinity,
        closeButton: true,
        onDismiss: () => {
          const url = new URL(window.location.href);
          url.searchParams.delete(REMOVED_ITEMS_PARAM);
          router.replace(url.href);
        },
        description: <Translation>{(t) => t('shop:items-removed.message')}</Translation>,
      });
    }
  }, [hasRemovedItems, router]);

  return null;
};
