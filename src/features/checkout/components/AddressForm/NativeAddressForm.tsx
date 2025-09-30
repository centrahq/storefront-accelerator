'use client';

import { Checkbox, Field, Fieldset, Input, Label, Legend, Select } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/16/solid';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { useTranslation } from '@/features/i18n/useTranslation/client';
import { UserError } from '@/lib/centra/errors';
import { checkUnavailableItems, REMOVED_ITEMS_PARAM } from '@/lib/utils/unavailableItems';

import { useSetAddress } from '../../mutations';
import { checkoutQuery } from '../../queries';

/**
 * TODO: Address fields from Centra are unreliable
 * https://centracommerce.atlassian.net/browse/DT-687
 * https://centracommerce.atlassian.net/browse/DT-688
 */

interface AddressFormProps {
  countries: Array<{
    code: string;
    name: string;
    states?: Array<{
      name: string;
      code: string;
    }>;
  }>;
}

const addressSchema = z.object({
  address1: z.string(),
  address2: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  country: z.string(),
  state: z.string().nullable().optional(),
  city: z.string(),
  email: z.email(),
  phoneNumber: z.string().optional(),
  zipCode: z.string(),
});

const addressFormSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
});

export const NativeAddressForm = ({ countries }: AddressFormProps) => {
  const { t } = useTranslation(['checkout', 'shop']);
  const setAddressMutation = useSetAddress();
  const { data } = useSuspenseQuery(checkoutQuery);
  const router = useRouter();

  const { shippingAddress, separateBillingAddress: billingAddress } = data.checkout;

  const [shippingCountry, setShippingCountry] = useState(shippingAddress.country?.code ?? '');
  const [billingCountry, setBillingCountry] = useState(billingAddress?.country?.code ?? '');
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(() => {
    if (!billingAddress) {
      return true;
    }

    return Object.keys(billingAddress).every((_key) => {
      const key = _key as keyof typeof billingAddress;

      if (key === 'country' || key === 'state') {
        return (billingAddress[key]?.code ?? '') === (shippingAddress[key]?.code ?? '');
      }

      return (billingAddress[key] ?? '') === (shippingAddress[key] ?? '');
    });
  });

  const shippingStates = countries.find((country) => country.code === shippingCountry)?.states ?? [];
  const billingStates = countries.find((country) => country.code === billingCountry)?.states ?? [];

  const changeAddress = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const shippingAddress = {
      address1: formData.get('shipping.address1'),
      address2: formData.get('shipping.address2'),
      firstName: formData.get('shipping.firstName'),
      lastName: formData.get('shipping.lastName'),
      country: formData.get('shipping.country'),
      state: formData.get('shipping.state'),
      city: formData.get('shipping.city'),
      email: formData.get('shipping.email'),
      phoneNumber: formData.get('shipping.phoneNumber'),
      zipCode: formData.get('shipping.zipCode'),
    };

    const billingAddress =
      formData.get('sameAsShipping') === 'on'
        ? {
            ...shippingAddress,
            companyName: '',
            vatNumber: '',
          }
        : {
            address1: formData.get('billing.address1'),
            address2: formData.get('billing.address2'),
            firstName: formData.get('billing.firstName'),
            lastName: formData.get('billing.lastName'),
            country: formData.get('billing.country'),
            state: formData.get('billing.state'),
            city: formData.get('billing.city'),
            email: formData.get('billing.email'),
            phoneNumber: formData.get('billing.phoneNumber'),
            zipCode: formData.get('billing.zipCode'),
            companyName: formData.get('billing.companyName'),
            vatNumber: formData.get('billing.vatNumber'),
          };

    const parsedAddress = addressFormSchema.safeParse({
      shippingAddress,
      billingAddress,
    });

    if (!parsedAddress.success) {
      toast.error(t('checkout:errors.fill-in-required-fields'));
      return;
    }

    setAddressMutation.mutate(parsedAddress.data, {
      onSuccess: () => {
        router.push('/checkout/delivery');
      },
      onError: (error) => {
        if (error instanceof UserError && checkUnavailableItems(error.userErrors)) {
          /*
            If some items were removed from the cart due to country change,
            we want to update locale in the URL and show a toast.
          */
          router.push(`/checkout?${REMOVED_ITEMS_PARAM}=true`);
        } else {
          toast.error(t('checkout:errors.save-address'));
        }
      },
    });
  };

  return (
    <form onSubmit={changeAddress} className="flex flex-col gap-5">
      <Fieldset>
        <div className="flex flex-col gap-5">
          <Legend className="text-xl font-medium">{t('checkout:shipping-address')}</Legend>
          <div className="grid grid-cols-2 gap-5">
            <Field className="flex flex-col gap-1">
              <Label>{t('shop:addressForm.labels.country')}</Label>
              <div className="relative flex items-center">
                <Select
                  name="shipping.country"
                  className="border-mono-300 bg-mono-0 block w-full appearance-none border px-6 py-3 text-sm"
                  value={shippingCountry}
                  onChange={(evt) => setShippingCountry(evt.target.value)}
                  required
                >
                  <option value="">{t('shop:addressForm.placeholders.select-country')}</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </Select>
                <ChevronDownIcon className="pointer-events-none absolute right-6 size-4" aria-hidden="true" />
              </div>
            </Field>
            {shippingStates.length > 0 && (
              <Field className="flex flex-col gap-1">
                <Label>{t('shop:addressForm.labels.state')}</Label>
                <div className="relative flex items-center">
                  <Select
                    name="shipping.state"
                    className="border-mono-300 bg-mono-0 block w-full appearance-none border px-6 py-3 text-sm"
                    defaultValue={shippingAddress.state?.code}
                    required
                  >
                    <option value="">{t('shop:addressForm.placeholders.select-state')}</option>
                    {shippingStates.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </Select>
                  <ChevronDownIcon className="pointer-events-none absolute right-6 size-4" aria-hidden="true" />
                </div>
              </Field>
            )}
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Field className="flex flex-col gap-1">
              <Label>{t('shop:addressForm.labels.firstName')}</Label>
              <Input
                className="border-mono-300 border px-6 py-3 text-sm"
                name="shipping.firstName"
                defaultValue={shippingAddress.firstName ?? ''}
                required
              />
            </Field>
            <Field className="flex flex-col gap-1">
              <Label>{t('shop:addressForm.labels.lastName')}</Label>
              <Input
                className="border-mono-300 border px-6 py-3 text-sm"
                name="shipping.lastName"
                defaultValue={shippingAddress.lastName ?? ''}
                required
              />
            </Field>
          </div>
          <Field className="flex flex-col gap-1">
            <Label>{t('shop:addressForm.labels.address1')}</Label>
            <Input
              className="border-mono-300 border px-6 py-3 text-sm"
              name="shipping.address1"
              defaultValue={shippingAddress.address1 ?? ''}
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
              name="shipping.address2"
              defaultValue={shippingAddress.address2 ?? ''}
            />
          </Field>
          <div className="grid grid-cols-2 gap-5">
            <Field className="flex flex-col gap-1">
              <Label>{t('shop:addressForm.labels.zipCode')}</Label>
              <Input
                className="border-mono-300 border px-6 py-3 text-sm"
                name="shipping.zipCode"
                defaultValue={shippingAddress.zipCode ?? ''}
                required
              />
            </Field>
            <Field className="flex flex-col gap-1">
              <Label>{t('shop:addressForm.labels.city')}</Label>
              <Input
                className="border-mono-300 border px-6 py-3 text-sm"
                name="shipping.city"
                defaultValue={shippingAddress.city ?? ''}
                required
              />
            </Field>
          </div>
          <Field className="flex flex-col gap-1">
            <Label>{t('shop:addressForm.labels.email')}</Label>
            <Input
              type="email"
              className="border-mono-300 border px-6 py-3 text-sm"
              name="shipping.email"
              defaultValue={shippingAddress.email ?? ''}
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
              name="shipping.phoneNumber"
              defaultValue={shippingAddress.phoneNumber ?? ''}
            />
          </Field>
        </div>
      </Fieldset>
      <Field className="flex items-center gap-3">
        <Checkbox
          name="sameAsShipping"
          checked={billingSameAsShipping}
          onChange={setBillingSameAsShipping}
          className="group border-mono-500 flex size-5 items-center justify-center rounded-sm border"
        >
          <CheckIcon className="hidden size-4 fill-black group-data-checked:block" aria-hidden="true" />
        </Checkbox>
        <Label>{t('shop:addressForm.labels.sameAsShipping')}</Label>
      </Field>

      {!billingSameAsShipping && (
        <Fieldset>
          <div className="flex flex-col gap-5">
            <Legend className="text-xl font-medium">{t('checkout:billing-address')}</Legend>
            <div className="grid grid-cols-2 gap-5">
              <Field className="flex flex-col gap-1">
                <Label>{t('shop:addressForm.labels.country')}</Label>
                <div className="relative flex items-center">
                  <Select
                    className="border-mono-300 bg-mono-0 block w-full appearance-none border px-6 py-3 text-sm"
                    name="billing.country"
                    value={billingCountry}
                    onChange={(evt) => setBillingCountry(evt.target.value)}
                    required
                  >
                    <option value="">{t('shop:addressForm.placeholders.select-country')}</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </Select>
                  <ChevronDownIcon className="pointer-events-none absolute right-6 size-4" aria-hidden="true" />
                </div>
              </Field>
              {billingStates.length > 0 && (
                <Field className="flex flex-col gap-1">
                  <Label>{t('shop:addressForm.labels.state')}</Label>
                  <div className="relative flex items-center">
                    <Select
                      className="border-mono-300 bg-mono-0 block w-full appearance-none border px-6 py-3 text-sm"
                      name="billing.state"
                      defaultValue={billingAddress?.state?.code}
                      required
                    >
                      <option value="">{t('shop:addressForm.placeholders.select-state')}</option>
                      {billingStates.map((state) => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </Select>
                    <ChevronDownIcon className="pointer-events-none absolute right-6 size-4" aria-hidden="true" />
                  </div>
                </Field>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Field className="relative flex flex-col gap-1">
                <Label>{t('shop:addressForm.labels.firstName')}</Label>
                <div aria-hidden className="text-mono-500 absolute top-0 right-0 text-sm font-medium">
                  {t('shop:addressForm.optional')}
                </div>
                <Input
                  className="border-mono-300 border px-6 py-3 text-sm"
                  name="billing.firstName"
                  defaultValue={billingAddress?.firstName ?? ''}
                />
              </Field>
              <Field className="relative flex flex-col gap-1">
                <Label>{t('shop:addressForm.labels.lastName')}</Label>
                <div aria-hidden className="text-mono-500 absolute top-0 right-0 text-sm font-medium">
                  {t('shop:addressForm.optional')}
                </div>
                <Input
                  className="border-mono-300 border px-6 py-3 text-sm"
                  name="billing.lastName"
                  defaultValue={billingAddress?.lastName ?? ''}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Field className="relative flex flex-col gap-1">
                <Label>{t('shop:addressForm.labels.companyName')}</Label>
                <div aria-hidden className="text-mono-500 absolute top-0 right-0 text-sm font-medium">
                  {t('shop:addressForm.optional')}
                </div>
                <Input
                  className="border-mono-300 border px-6 py-3 text-sm"
                  name="billing.companyName"
                  defaultValue={billingAddress?.companyName ?? ''}
                />
              </Field>
              <Field className="relative flex flex-col gap-1">
                <Label>{t('shop:addressForm.labels.vatNumber')}</Label>
                <div aria-hidden className="text-mono-500 absolute top-0 right-0 text-sm font-medium">
                  {t('shop:addressForm.optional')}
                </div>
                <Input
                  className="border-mono-300 border px-6 py-3 text-sm"
                  name="billing.vatNumber"
                  defaultValue={billingAddress?.vatNumber ?? ''}
                />
              </Field>
            </div>

            <Field className="flex flex-col gap-1">
              <Label>{t('shop:addressForm.labels.address1')}</Label>
              <Input
                className="border-mono-300 border px-6 py-3 text-sm"
                name="billing.address1"
                defaultValue={billingAddress?.address1 ?? ''}
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
                name="billing.address2"
                defaultValue={billingAddress?.address2 ?? ''}
              />
            </Field>
            <div className="grid grid-cols-2 gap-5">
              <Field className="flex flex-col gap-1">
                <Label>{t('shop:addressForm.labels.zipCode')}</Label>
                <Input
                  className="border-mono-300 border px-6 py-3 text-sm"
                  name="billing.zipCode"
                  defaultValue={billingAddress?.zipCode ?? ''}
                  required
                />
              </Field>
              <Field className="flex flex-col gap-1">
                <Label>{t('shop:addressForm.labels.city')}</Label>
                <Input
                  className="border-mono-300 border px-6 py-3 text-sm"
                  name="billing.city"
                  defaultValue={billingAddress?.city ?? ''}
                  required
                />
              </Field>
            </div>

            <Field className="flex flex-col gap-1">
              <Label>{t('shop:addressForm.labels.email')}</Label>
              <Input
                className="border-mono-300 border px-6 py-3 text-sm"
                type="email"
                name="billing.email"
                defaultValue={billingAddress?.email ?? ''}
                required
              />
            </Field>
            <Field className="relative flex flex-col gap-1">
              <Label>{t('shop:addressForm.labels.phoneNumber')}</Label>
              <div aria-hidden className="text-mono-500 absolute top-0 right-0 text-sm font-medium">
                {t('shop:addressForm.optional')}
              </div>
              <Input
                className="border-mono-300 border px-6 py-3 text-sm"
                type="tel"
                name="billing.phoneNumber"
                defaultValue={billingAddress?.phoneNumber ?? ''}
              />
            </Field>
          </div>
        </Fieldset>
      )}
      <button
        type="submit"
        disabled={setAddressMutation.isPending}
        className={clsx(
          'bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase',
          {
            'animate-pulse': setAddressMutation.isPending,
          },
        )}
      >
        {t('checkout:continue')}
      </button>
    </form>
  );
};
