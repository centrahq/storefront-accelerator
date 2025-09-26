import { Field, Fieldset, Label, Legend, Radio, RadioGroup } from '@headlessui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useTranslation } from '@/features/i18n/useTranslation/client';
import { useDebouncedState } from '@/hooks/useDebouncedState';

import { useSetPaymentMethod } from '../../mutations';
import { checkoutQuery } from '../../queries';

export const PaymentMethodField = () => {
  const { t } = useTranslation(['checkout']);
  const { data } = useSuspenseQuery(checkoutQuery);
  const setPaymentMethodMutation = useSetPaymentMethod();

  const { paymentMethods, paymentMethod } = data.checkout;

  const paymentMethodId = setPaymentMethodMutation.isPending ? setPaymentMethodMutation.variables : paymentMethod?.id;

  const [selectedMethod, setSelectedMethod] = useDebouncedState(paymentMethodId, (newMethod) => {
    if (newMethod) {
      setPaymentMethodMutation.mutate(newMethod, {
        onError: () => {
          toast.error(t('checkout:errors.set-payment-method'), {
            id: 'payment-error',
          });
        },
      });
    }
  });

  if (paymentMethods.length === 0) {
    return <p>{t('checkout:no-payment-methods')}</p>;
  }

  return (
    <Fieldset>
      <Legend className="sr-only">{t('checkout:payment-method')}</Legend>
      <div className="flex flex-col gap-5">
        <RadioGroup
          value={selectedMethod}
          onChange={setSelectedMethod}
          className="border-mono-200 bg-mono-0 flex flex-col border"
        >
          {paymentMethods.map((paymentMethod) => (
            <Field
              key={paymentMethod.id}
              className="border-mono-200 has-data-checked:bg-mono-50 relative cursor-pointer p-5 not-last:border-b"
            >
              <div className="flex items-center gap-2">
                <Radio value={paymentMethod.id} className="group">
                  <span className="border-mono-900 bg-mono-0 flex size-5 items-center justify-center rounded-full border">
                    <span className="bg-mono-900 invisible size-3 rounded-full group-data-checked:visible" />
                  </span>
                  <span className="absolute inset-0" />
                </Radio>
                <Label>
                  {paymentMethod.name}
                  {paymentMethod.handlingCost.value > 0 && <span> ({paymentMethod.handlingCost.formattedValue})</span>}
                </Label>
              </div>
            </Field>
          ))}
        </RadioGroup>
      </div>
    </Fieldset>
  );
};
