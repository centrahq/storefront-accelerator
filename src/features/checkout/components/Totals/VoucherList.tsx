'use client';

import { VoucherFragment } from '@gql/graphql';

import { RemoveVoucherButton } from './RemoveVoucherButton';

export const VoucherList = ({ discounts }: { discounts: VoucherFragment[] }) => {
  const codeDiscounts = discounts.filter((discount) => 'code' in discount);

  if (codeDiscounts.length === 0) {
    return null;
  }

  return (
    <ul>
      {codeDiscounts.map((discount) => (
        <li key={discount.code} className="flex justify-between text-sm">
          <div className="flex items-baseline gap-1">
            <p className="text-mono-500">{discount.name}</p>
            <RemoveVoucherButton code={discount.code} />
          </div>
          <p>{discount.value.formattedValue}</p>
        </li>
      ))}
    </ul>
  );
};
