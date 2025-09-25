import { Field, Fieldset, Label, Legend, Radio, RadioGroup } from '@headlessui/react';
import clsx from 'clsx';

import { useTranslation } from '@/features/i18n/useTranslation/client';

interface Props {
  items: Array<{
    id: string;
    isAvailable: boolean;
    name: string;
    quantity?: number;
  }>;
  value: string | null;
  onChange: (value: string) => void;
  hiddenLegend?: boolean;
}

export const ItemsField = ({ items, value, onChange, hiddenLegend = false }: Props) => {
  const { t } = useTranslation(['shop']);

  return (
    <Fieldset>
      <div className="flex flex-col gap-3">
        <Legend className={clsx('font-bold', { 'sr-only': hiddenLegend })}>{t('shop:product.size')}</Legend>
        <RadioGroup value={value} onChange={onChange} className="flex flex-wrap gap-2 text-sm font-medium">
          {items.map((item) => (
            <Field
              key={item.id}
              className="border-mono-300 has-data-checked:border-mono-200 has-data-checked:bg-mono-200 has-data-disabled:bg-mono-500 relative border px-6 py-2 font-mono"
            >
              <Radio
                className="absolute inset-0 cursor-pointer data-disabled:cursor-not-allowed"
                value={item.id}
                disabled={!item.isAvailable}
              />
              <Label>
                {item.name} {item.quantity != null && `(${item.quantity})`}
              </Label>
            </Field>
          ))}
        </RadioGroup>
      </div>
    </Fieldset>
  );
};
