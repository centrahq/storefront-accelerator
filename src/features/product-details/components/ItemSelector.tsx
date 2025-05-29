'use client';

import { parseAsString, useQueryState } from 'nuqs';

import { ItemsField } from './ItemsField';

interface Props {
  items: Array<{
    id: string;
    isAvailable: boolean;
    name: string;
  }>;
}

export const ItemSelector = ({ items }: Props) => {
  const [selectedItem, setSelectedItem] = useQueryState('item', parseAsString.withDefault(items[0]?.id ?? ''));

  return <ItemsField items={items} value={selectedItem} onChange={(val) => void setSelectedItem(val)} />;
};
