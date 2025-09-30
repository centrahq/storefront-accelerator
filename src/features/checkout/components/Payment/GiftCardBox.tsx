'use client';

import { Field, Input, Label } from '@headlessui/react';
import { TagIcon } from '@heroicons/react/24/outline';
import { useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@/features/i18n/useTranslation/client';
import { UserError } from '@/lib/centra/errors';

import { useApplyGiftCard } from '../../mutations';
import { checkoutQuery } from '../../queries';
import { RemoveVoucherButton } from '../Totals/RemoveVoucherButton';

export const GiftCardBox = () => {
  const { data } = useSuspenseQuery(checkoutQuery);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(['checkout']);

  if (!data.externalGiftCardAvailable) {
    return null;
  }

  const appliedGiftCardVouchers = data.discounts
    .filter((discount) => 'code' in discount)
    .filter((discount) => discount.giftCard);

  return (
    <div className="bg-mono-0 p-10">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-xl">{t('checkout:gift-card.title')}</h2>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="text-sm font-medium underline underline-offset-3"
        >
          {isOpen ? t('checkout:gift-card.cancel') : t('checkout:gift-card.redeem')}
        </button>
      </div>
      <div className="flex flex-col gap-5">
        <p className="text-mono-500 text-sm">{t('checkout:gift-card.hint')}</p>
        {isOpen && <GiftCardForm onSuccess={() => setIsOpen(false)} />}
        {appliedGiftCardVouchers.length > 0 && (
          <div className="flex flex-col gap-4 text-sm">
            {appliedGiftCardVouchers.map((voucher) => (
              <div key={voucher.name} className="flex flex-col gap-3">
                <div className="bg-mono-50 flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <TagIcon className="text-mono-500 size-5" aria-hidden="true" />
                    <span className="font-medium">**** {voucher.giftCard?.lastFourDigits ?? ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-mono-500">Discount:</span>
                    <span className="font-medium">{voucher.value.formattedValue}</span>
                  </div>
                </div>
                <RemoveVoucherButton
                  code={voucher.code}
                  className="border-mono-900 self-start border px-6 py-3 text-xs font-bold uppercase"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const GiftCardForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation(['checkout']);
  const applyGiftCardMutation = useApplyGiftCard();

  const addVoucher = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    applyGiftCardMutation.mutate(
      { cardNumber: formData.get('cardNumber') as string, pin: formData.get('pin') as string },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error) => {
          if (!(error instanceof UserError)) {
            toast.error(t('checkout:gift-card.could-not-apply'));

            return;
          }

          switch (error.userErrors[0]?.message) {
            case 'invalid_input':
              toast.error(t('checkout:gift-card.invalid-input'));
              break;

            case 'inactive_card':
              toast.error(t('checkout:gift-card.inactive-card'));
              break;

            case 'insufficient_funds':
              toast.error(t('checkout:gift-card.insufficient-funds'));
              break;

            case 'invalid_gift_card_currency':
              toast.error(t('checkout:gift-card.invalid-currency'));
              break;

            case 'empty_card_balance':
              toast.error(t('checkout:gift-card.empty-balance'));
              break;

            default:
              toast.error(t('checkout:gift-card.could-not-apply'));
              break;
          }
        },
      },
    );
  };

  return (
    <form onSubmit={addVoucher} className="flex flex-col gap-3">
      <div className="flex gap-5">
        <Field className="flex grow flex-col gap-1">
          <Label>{t('checkout:gift-card.card-number')}</Label>
          <Input
            name="cardNumber"
            required
            className="border-mono-300 placeholder:text-mono-600 grow border px-6 py-3 text-sm"
          />
        </Field>
        <Field className="flex min-w-36 shrink basis-36 flex-col gap-1">
          <Label>{t('checkout:gift-card.pin')}</Label>
          <Input name="pin" className="border-mono-300 placeholder:text-mono-600 grow border px-6 py-3 text-sm" />
        </Field>
      </div>
      <button
        type="submit"
        disabled={applyGiftCardMutation.isPending}
        className={clsx('border-mono-900 self-start border px-6 py-3 text-xs font-bold uppercase', {
          'animate-pulse': applyGiftCardMutation.isPending,
        })}
      >
        {t('checkout:gift-card.apply')}
      </button>
    </form>
  );
};
