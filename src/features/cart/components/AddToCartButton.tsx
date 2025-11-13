'use client';

import clsx from 'clsx';
import { parseAsString, useQueryState } from 'nuqs';
import { useContext } from 'react';
import { toast } from 'sonner';

import { AdyenExpressCheckout } from '@/features/checkout/components/Payment/AdyenExpressCheckout';
import { AdyenExpressCheckoutErrorBoundary } from '@/features/checkout/components/Payment/AdyenExpressCheckoutErrorBoundary';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { parseAsBundledItems } from '@/features/product-details/bundle/components/bundledItemsSearchParam';

import { useAddFlexibleBundleToCart, useAddToCart } from '../mutations';
import { CartContext } from './CartContext';

interface AddToCartButtonProps {
  isFlexibleBundle?: boolean;
  items: Array<{
    id: string;
    isAvailable: boolean;
  }>;
  productName: string;
  productPrice: number;
  bundleItemAvailability: { [sectionId: number]: { [itemId: string]: boolean } };
}

export const AddToCartButton = ({ items, isFlexibleBundle, bundleItemAvailability, productName, productPrice }: AddToCartButtonProps) => {
  const { t } = useTranslation(['shop']);
  const [itemId] = useQueryState('item', parseAsString.withDefault(items[0]?.id ?? ''));
  const [bundledItems] = useQueryState('bundledItems', parseAsBundledItems);
  const [selectedPlan] = useQueryState('plan', parseAsString.withDefault(''));
  const addToCartMutation = useAddToCart();
  const addFlexibleBundleToCartMutation = useAddFlexibleBundleToCart();
  const { setIsCartOpen } = useContext(CartContext);

  const currentItem = items.find((item) => item.id === itemId);
  const isCurrentItemAvailable = currentItem?.isAvailable ?? false;

  const addFlexibleBundle = () => {
    const sections = Object.entries(bundledItems).map(([sectionId, item]) => ({
      sectionId: Number(sectionId),
      item,
    }));

    const hasSelectedItems =
      sections.length === Object.keys(bundleItemAvailability).length &&
      sections.every((section) => bundleItemAvailability[section.sectionId]?.[section.item]);

    if (!hasSelectedItems) {
      toast.error(t('shop:product.select-bundle-sizes'));
      return;
    }

    addFlexibleBundleToCartMutation.mutate(
      { item: itemId, sections, subscriptionPlan: selectedPlan !== '' ? Number(selectedPlan) : undefined },
      {
        onSuccess: () => {
          setIsCartOpen(true);
        },
        onError: () => {
          toast.error(t('shop:cart.errors.add'));
        },
      },
    );
  };

  const addProduct = () => {
    const item = items.find((item) => item.id === itemId);

    if (!item || !item.isAvailable) {
      toast.error(t('shop:product.select-size'));
      return;
    }

    addToCartMutation.mutate(
      { item: itemId, subscriptionPlan: selectedPlan !== '' ? Number(selectedPlan) : undefined },
      {
        onSuccess: () => {
          setIsCartOpen(true);
        },
        onError: () => {
          toast.error(t('shop:cart.errors.add'));
        },
      },
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={isFlexibleBundle ? addFlexibleBundle : addProduct}
        disabled={addToCartMutation.isPending}
        className={clsx(
          'bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase sm:max-w-52',
          {
            'animate-pulse': addToCartMutation.isPending,
          },
        )}
      >
        {selectedPlan === '' ? t('shop:product.add-to-cart') : t('shop:product.subscriptions.subscribe')}
      </button>
      {process.env.NEXT_PUBLIC_ADYEN_EXPRESS_CHECKOUT_ENABLED === 'true' && (
        <AdyenExpressCheckoutErrorBoundary>
          <AdyenExpressCheckout
            itemId={itemId}
            cartTotal={productPrice}
            disabled={!isCurrentItemAvailable}
            initialLineItems={[{ name: productName, price: productPrice.toFixed(2) }]}
          />
        </AdyenExpressCheckoutErrorBoundary>
      )}
    </>
  );
};
