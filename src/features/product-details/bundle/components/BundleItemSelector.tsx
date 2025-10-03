'use client';

import { useQueryState } from 'nuqs';

import { ItemsField } from '../../components/ItemsField';
import { parseAsBundledItems } from './bundledItemsSearchParam';

interface Props {
  items: Array<{
    id: string;
    isAvailable: boolean;
    name: string;
  }>;
  sectionId: number;
  sizeGuideTable?: string;
}

export const BundleItemSelector = ({ items, sectionId, sizeGuideTable }: Props) => {
  const [bundledItems, setBundledItems] = useQueryState('bundledItems', parseAsBundledItems);

  return (
    <ItemsField
      items={items}
      value={bundledItems[sectionId]}
      onChange={(val) => {
        void setBundledItems((old) => ({ ...old, [sectionId]: val }));
      }}
      hiddenLegend
      sizeGuideTable={sizeGuideTable}
    />
  );
};
