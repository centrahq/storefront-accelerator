import { Field, Input, Label } from '@headlessui/react';
import clsx from 'clsx';
import { FormEvent } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { useTranslation } from '@/features/i18n/useTranslation/client';
import { SubscriptionContractFragment } from '@gql/graphql';

import { useChangeSubscriptionContractAddress } from '../mutations';

interface SubscriptionAddressFormProps {
  contract: SubscriptionContractFragment;
  closeForm: () => void;
}

const addressSchema = z.object({
  address1: z.string(),
  address2: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  city: z.string(),
  email: z.email(),
  phoneNumber: z.string().optional(),
  zipCode: z.string(),
});

export const SubscriptionAddressForm = ({ contract, closeForm }: SubscriptionAddressFormProps) => {
  const { t } = useTranslation(['shop']);
  const changeAddressMutation = useChangeSubscriptionContractAddress();

  const updateAddress = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const address = {
      address1: formData.get('address1'),
      address2: formData.get('address2'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      city: formData.get('city'),
      email: formData.get('email'),
      phoneNumber: formData.get('phoneNumber'),
      zipCode: formData.get('zipCode'),
    };

    const parsedAddress = addressSchema.safeParse(address);

    if (!parsedAddress.success) {
      toast.error(t('shop:addressForm.errors.fill-in-required-fields'));
      return;
    }

    changeAddressMutation.mutate(
      {
        contractId: contract.id,
        address: parsedAddress.data,
      },
      {
        onSuccess: () => {
          closeForm();
        },
        onError: () => {
          toast.error(t('shop:user.subscriptions.errors.address-update'));
        },
      },
    );
  };

  return (
    <form onSubmit={updateAddress} className="flex max-w-xl flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Field className="flex flex-col gap-1">
            <Label>{t('shop:addressForm.labels.firstName')}</Label>
            <Input
              className="border-mono-300 border px-6 py-3 text-sm"
              name="firstName"
              defaultValue={contract.shippingAddress.firstName ?? ''}
              required
            />
          </Field>
          <Field className="flex flex-col gap-1">
            <Label>{t('shop:addressForm.labels.lastName')}</Label>
            <Input
              className="border-mono-300 border px-6 py-3 text-sm"
              name="lastName"
              defaultValue={contract.shippingAddress.lastName ?? ''}
              required
            />
          </Field>
        </div>
        <Field className="flex flex-col gap-1">
          <Label>{t('shop:addressForm.labels.address1')}</Label>
          <Input
            className="border-mono-300 border px-6 py-3 text-sm"
            name="address1"
            defaultValue={contract.shippingAddress.address1 ?? ''}
            required
          />
        </Field>
        <Field className="relative flex flex-col gap-1">
          <Label>{t('shop:addressForm.labels.address2')}</Label>
          <div aria-hidden className="text-mono-500 absolute top-0 right-0 text-sm font-medium">
            {t('shop:addressForm.optional')}
          </div>
          <Input
            className="border-mono-300 border px-6 py-3 text-sm"
            name="address2"
            defaultValue={contract.shippingAddress.address2 ?? ''}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field className="flex flex-col gap-1">
            <Label>{t('shop:addressForm.labels.zipCode')}</Label>
            <Input
              className="border-mono-300 border px-6 py-3 text-sm"
              name="zipCode"
              defaultValue={contract.shippingAddress.zipCode ?? ''}
              required
            />
          </Field>
          <Field className="flex flex-col gap-1">
            <Label>{t('shop:addressForm.labels.city')}</Label>
            <Input
              className="border-mono-300 border px-6 py-3 text-sm"
              name="city"
              defaultValue={contract.shippingAddress.city ?? ''}
              required
            />
          </Field>
        </div>
        <Field className="flex flex-col gap-1">
          <Label>{t('shop:addressForm.labels.email')}</Label>
          <Input
            type="email"
            className="border-mono-300 border px-6 py-3 text-sm"
            name="email"
            defaultValue={contract.shippingAddress.email ?? ''}
            required
          />
        </Field>
        <Field className="relative flex flex-col gap-1">
          <Label>{t('shop:addressForm.labels.phoneNumber')}</Label>
          <div aria-hidden className="text-mono-500 absolute top-0 right-0 text-sm font-medium">
            {t('shop:addressForm.optional')}
          </div>
          <Input
            type="tel"
            className="border-mono-300 border px-6 py-3 text-sm"
            name="phoneNumber"
            defaultValue={contract.shippingAddress.phoneNumber ?? ''}
          />
        </Field>
      </div>
      <button
        type="submit"
        disabled={changeAddressMutation.isPending}
        className={clsx(
          'bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase',
          {
            'animate-pulse': changeAddressMutation.isPending,
          },
        )}
      >
        {t('shop:user.subscriptions.update-address')}
      </button>
      <button
        type="button"
        disabled={changeAddressMutation.isPending}
        onClick={() => closeForm()}
        className={clsx(
          'bg-mono-0 text-mono-900 border-mono-900 flex w-full items-center justify-center border px-6 py-4 text-xs font-bold uppercase',
          {
            'animate-pulse': changeAddressMutation.isPending,
          },
        )}
      >
        {t('shop:user.subscriptions.cancel-edit')}
      </button>
    </form>
  );
};
