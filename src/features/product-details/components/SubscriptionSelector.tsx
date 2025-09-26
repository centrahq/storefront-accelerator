'use client';

import { Description, Field, Fieldset, Label, Legend, Radio, RadioGroup } from '@headlessui/react';
import { parseAsString, useQueryState } from 'nuqs';

import { useTranslation } from '@/features/i18n/useTranslation/client';
import { SubscriptionPlanFragment } from '@gql/graphql';

export const SubscriptionSelector = ({ plans }: { plans: SubscriptionPlanFragment[] }) => {
  const [selectedPlan, setSelectedPlan] = useQueryState('plan', parseAsString.withDefault(''));
  const { t } = useTranslation(['shop']);

  const subscriptionOptions = [
    {
      value: '',
      label: t('shop:product.subscriptions.buy-once'),
      discount: undefined,
    },
    ...plans.map((plan) => ({
      value: String(plan.id),
      label: t('shop:product.subscriptions.every', {
        count: plan.interval.value,
        context: plan.interval.type,
      }),
      discount: plan.discount,
    })),
  ];

  return (
    <Fieldset className="flex flex-col gap-3">
      <Legend className="text-xl font-medium">{t('product.subscriptions.title')}</Legend>
      <div className="flex flex-col gap-5">
        <RadioGroup
          value={selectedPlan}
          onChange={(newPlan) => {
            void setSelectedPlan(newPlan);
          }}
          className="flex flex-col gap-2"
        >
          {subscriptionOptions.map((plan) => (
            <Field
              key={plan.value}
              className="group has-data-checked:bg-mono-200 has-data-checked:border-mono-200 border-mono-300 relative flex h-14 cursor-pointer items-center gap-2 border px-6"
            >
              <Radio value={plan.value} className="absolute inset-0" />
              <div className="flex w-full items-center justify-between">
                <Label className="text-sm font-bold">{plan.label}</Label>
                {plan.discount && (
                  <Description className="bg-mono-300 group-has-data-checked:bg-mono-900 group-has-data-checked:text-mono-0 px-2 py-1 text-sm">
                    {t('shop:product.subscriptions.save-percent', { discount: plan.discount })}
                  </Description>
                )}
              </div>
            </Field>
          ))}
        </RadioGroup>
      </div>
    </Fieldset>
  );
};
