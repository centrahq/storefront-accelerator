'use client';

import { Description, Field, Fieldset, Label, Legend, Radio, RadioGroup } from '@headlessui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useTranslation } from '@/features/i18n/useTranslation/client';

import { useSetShippingMethod } from '../mutations';
import { checkoutQuery } from '../queries';

export const DeliveryForm = () => {
  const { data } = useSuspenseQuery(checkoutQuery);
  const { t } = useTranslation(['checkout']);
  const setShippingMethodMutation = useSetShippingMethod();
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  const shippingMethods = data.checkout.shippingMethods?.toSorted((a, b) => a.name.localeCompare(b.name)) ?? [];

  if (shippingMethods.length === 0) {
    return <p>{t('checkout:errors.cant-ship-to-country')}</p>;
  }

  const selectedShippingMethod = data.checkout.shippingMethod?.id;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const shippingMethod = formData.get('shippingMethod');
    setShippingMethodMutation.mutate(Number(shippingMethod), {
      onSuccess: () => {
        router.push(`/${locale}/checkout/payment`);
      },
      onError: () => {
        toast.error(t('checkout:errors.save-shipping'));
      },
    });
  };

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <Fieldset>
          <div className="flex flex-col gap-5">
            <Legend as="legend" className="text-xl font-medium">
              {t('checkout:delivery-method')}
            </Legend>
            <RadioGroup
              name="shippingMethod"
              key={selectedShippingMethod}
              defaultValue={selectedShippingMethod}
              className="border-mono-200 bg-mono-0 flex flex-col border"
            >
              {shippingMethods.map((shippingMethod) => (
                <Field
                  key={shippingMethod.id}
                  className="group border-mono-200 has-data-checked:bg-mono-50 relative flex cursor-pointer flex-col gap-5 p-5 not-last:border-b"
                >
                  <div className="flex items-center gap-2">
                    <Radio value={shippingMethod.id} className="group">
                      <span className="border-mono-900 bg-mono-0 flex size-5 items-center justify-center rounded-full border">
                        <span className="bg-mono-900 invisible size-3 rounded-full group-data-checked:visible" />
                      </span>
                      <span className="absolute inset-0" />
                    </Radio>
                    <Label>
                      {shippingMethod.name}
                      {shippingMethod.price.value > 0 && <span> ({shippingMethod.price.formattedValue})</span>}
                    </Label>
                  </div>
                  {shippingMethod.comment && <Description>{shippingMethod.comment}</Description>}
                </Field>
              ))}
            </RadioGroup>
          </div>
        </Fieldset>
        <button
          type="submit"
          disabled={setShippingMethodMutation.isPending}
          className={clsx(
            'bg-mono-900 text-mono-0 flex w-full items-center justify-center px-6 py-4 text-xs font-bold uppercase',
            {
              'animate-pulse': setShippingMethodMutation.isPending,
            },
          )}
        >
          {t('checkout:continue')}
        </button>
      </form>
    </>
  );
};
