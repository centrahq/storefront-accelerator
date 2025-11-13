'use client';

import { parseAsString, useQueryState } from 'nuqs';

import { ItemsField } from './ItemsField';

interface Props {
  items: Array<{
    id: string;
    isAvailable: boolean;
    name: string;
    quantity?: number;
  }>;
  sizeGuideTable?: string;
}

export const ItemSelector = ({ items, sizeGuideTable }: Props) => {
  const [selectedItem, setSelectedItem] = useQueryState('item',  parseAsString.withDefault(items.filter((item) => item.isAvailable)[0]?.id ?? ''));

  return (
    <ItemsField
      items={items}
      value={selectedItem}
      onChange={(val) => void setSelectedItem(val)}
      sizeGuideTable={sizeGuideTable}
    />
  );
};
