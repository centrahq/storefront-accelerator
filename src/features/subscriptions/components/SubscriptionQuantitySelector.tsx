import { toast } from 'sonner';

import { useTranslation } from '@/features/i18n/useTranslation/client';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { SubscriptionInfoFragment } from '@gql/graphql';

import { useUpdateSubscriptionQuantity } from '../mutations';

interface SubscriptionQuantitySelectorProps {
  subscription: SubscriptionInfoFragment;
}

export const SubscriptionQuantitySelector = ({ subscription }: SubscriptionQuantitySelectorProps) => {
  const { t } = useTranslation(['shop']);
  const updateQuantityMutation = useUpdateSubscriptionQuantity();

  const optimisticQuantity = updateQuantityMutation.isPending
    ? updateQuantityMutation.variables.quantity
    : subscription.lines[0]?.quantity || 1;

  const [quantity, setQuantity] = useDebouncedState(optimisticQuantity, (newQuantity) => {
    if (newQuantity < 1) return;

    updateQuantityMutation.mutate(
      {
        subscriptionId: subscription.id,
        quantity: newQuantity,
      },
      {
        onError: () => {
          toast.error(t('shop:user.subscriptions.errors.update-quantity'));
        },
      },
    );
  });

  return (
    <div className="border-mono-300 bg-mono-0 text-mono-600 flex items-center gap-5 border px-2">
      <button type="button" className="font-bold" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
        <span aria-hidden>-</span>
        <span className="sr-only">{t('shop:cart.decrease')}</span>
      </button>
      <span className="min-w-[2ch] text-center font-mono text-sm font-medium">{quantity}</span>
      <button type="button" className="font-bold" onClick={() => setQuantity(quantity + 1)}>
        <span aria-hidden>+</span>
        <span className="sr-only">{t('shop:cart.increase')}</span>
      </button>
    </div>
  );
};
