import { CheckoutFragment, SelectionTotalRowType } from '@gql/graphql';

export const TotalRow = ({
  totals,
  type,
  term,
  pending = false,
  optional = false,
}: {
  totals: NonNullable<CheckoutFragment['checkout']>['totals'];
  type: SelectionTotalRowType;
  term: string;
  pending?: boolean;
  optional?: boolean;
}) => {
  const totalRow = totals.find((total) => total.type === type);

  if (totalRow && (!optional || totalRow.price.value)) {
    return (
      <div className="flex justify-between">
        <dt>{term}</dt>
        <dd className="text-mono-900">{pending ? '...' : totalRow.price.formattedValue}</dd>
      </div>
    );
  }
};
