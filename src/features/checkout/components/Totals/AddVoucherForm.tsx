'use client';

import { Field, Input, Label } from '@headlessui/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { useAddVoucher } from '../../mutations';

export const AddVoucherForm = () => {
  const addVoucherMutation = useAddVoucher();
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation(['checkout']);

  const addVoucher = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    addVoucherMutation.mutate(formData.get('voucher') as string, {
      onSuccess: () => {
        formRef.current?.reset();
      },
      onError: () => {
        toast.error(t('checkout:errors.add-voucher'));
      },
    });
  };

  return (
    <form ref={formRef} onSubmit={addVoucher}>
      <Field className="flex items-stretch gap-1">
        <Input
          name="voucher"
          required
          className="border-mono-300 placeholder:text-mono-600 grow border px-6 py-3 text-sm"
          placeholder={t('checkout:voucher.placeholder')}
        />
        <button
          type="submit"
          disabled={addVoucherMutation.isPending}
          className={clsx('border-mono-900 min-w-32 border px-6 text-xs font-bold uppercase', {
            'animate-pulse': addVoucherMutation.isPending,
          })}
        >
          {t('checkout:voucher.apply')}
        </button>
        <Label className="sr-only">{t('checkout:voucher.code')}</Label>
      </Field>
    </form>
  );
};
