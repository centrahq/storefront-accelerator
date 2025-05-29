'use client';

import {
  Field,
  Fieldset,
  Label,
  Legend,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Select,
} from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useQueryStates } from 'nuqs';

import { useTranslation } from '@/features/i18n/useTranslation/client';
import { ProductsQuery, SortKey, SortOrder } from '@gql/graphql';

import { productsFilterParsers } from '../productListSearchParams';

type Filter = NonNullable<ProductsQuery['displayItems']['filters']>[number];

type ProductFilter<T extends Filter['values'][number]['__typename']> = Omit<Filter, 'values'> & {
  values: Extract<Filter['values'][number], { __typename: T }>[];
};

export const ProductFilters = ({ filters }: { filters: Filter[] }) => {
  const [{ sort, brands, sizes }, setFilters] = useQueryStates(productsFilterParsers, { shallow: false });
  const { t } = useTranslation(['shop']);

  const brandFilters = filters.find((filter): filter is ProductFilter<'BrandFilterValue'> => filter.key === 'brands');
  const sizeFilters = filters.find(
    (filter): filter is ProductFilter<'SizeNameFilterValue'> => filter.key === 'itemName',
  );

  const brandOptions = brandFilters?.values.filter((filter) => Boolean(filter.name)) ?? [];
  const sizeOptions = sizeFilters?.values.filter((filter) => Boolean(filter.value)) ?? [];

  return (
    <div className="flex flex-wrap justify-between">
      {brandOptions.length > 0 && sizeOptions.length > 0 ? (
        <Fieldset>
          <div className="flex gap-8">
            <Legend as="legend" className="text-mono-500 flex items-center gap-2 font-medium">
              <FunnelIcon className="size-5" />
              <span>{t('shop:filters.filter-by')}</span>
            </Legend>
            {brandOptions.length > 0 && (
              <Listbox
                value={brands}
                onChange={(newBrands) => {
                  void setFilters((old) => ({
                    ...old,
                    brands: newBrands,
                    page: 1,
                  }));
                }}
                multiple
              >
                <ListboxButton className="bg-mono-0/5 flex items-center justify-between gap-3 rounded-lg px-3 py-2">
                  <span>{t('shop:filters.brand')}</span>
                  <ChevronDownIcon className="text-mono-900 size-4" />
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom start"
                  className="border-mono-200 bg-mono-0/95 min-w-[var(--button-width)] rounded-xs border p-1 shadow-xs [--anchor-gap:var(--spacing-1)] focus:outline-hidden"
                >
                  {brandOptions.map((filter) => (
                    <ListboxOption
                      key={filter.value}
                      value={filter.value}
                      className="group data-focus:bg-mono-300/95 flex cursor-default items-center gap-2 rounded-xs px-3 py-2 text-sm select-none"
                    >
                      <div className="border-mono-900 flex size-4 items-center justify-center rounded-full border">
                        <CheckIcon className="text-mono-900 invisible size-3 group-data-selected:visible" />
                      </div>
                      <div>
                        {filter.name} ({filter.filterCount})
                      </div>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            )}
            {sizeOptions.length > 0 && (
              <Listbox
                value={sizes}
                onChange={(newSizes) => {
                  void setFilters((old) => ({
                    ...old,
                    sizes: newSizes,
                    page: 1,
                  }));
                }}
                multiple
              >
                <ListboxButton className="bg-mono-0/5 flex items-center justify-between gap-4 rounded-lg px-3 py-2">
                  <span>{t('shop:filters.size')}</span>
                  <ChevronDownIcon className="text-mono-900 size-4" />
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom start"
                  className="border-mono-200 bg-mono-0/95 min-w-[var(--button-width)] rounded-xs border p-1 shadow-xs [--anchor-gap:var(--spacing-1)] focus:outline-hidden"
                >
                  {sizeOptions.map((filter) => (
                    <ListboxOption
                      key={filter.value}
                      value={filter.value}
                      className="group data-focus:bg-mono-300/95 flex cursor-default items-center gap-2 rounded-xs px-3 py-2 text-sm select-none"
                    >
                      <div className="border-mono-900 flex size-4 items-center justify-center rounded-full border">
                        <CheckIcon className="text-mono-900 invisible size-3 group-data-selected:visible" />
                      </div>
                      <div>
                        {filter.value} ({filter.filterCount})
                      </div>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            )}
          </div>
        </Fieldset>
      ) : (
        <div />
      )}
      <Field className="ml-auto flex items-center gap-3 py-2">
        <Label className="text-mono-500 font-medium">{t('shop:filters.sort-by')}</Label>
        <Select
          className="bg-transparent font-medium"
          value={sort}
          onChange={(evt) => void setFilters((filters) => ({ ...filters, sort: evt.target.value, page: 1 }))}
        >
          <option value="">{t('shop:filters.no-sorting')}</option>
          <option value={`${SortKey.CreatedAt}-${SortOrder.Desc}`}>{t('shop:filters.newest')}</option>
          <option value={`${SortKey.CreatedAt}-${SortOrder.Asc}`}>{t('shop:filters.oldest')}</option>
          <option value={`${SortKey.Price}-${SortOrder.Asc}`}>{t('shop:filters.price-low-to-high')}</option>
          <option value={`${SortKey.Price}-${SortOrder.Desc}`}>{t('shop:filters.price-high-to-low')}</option>
          <option value={`${SortKey.Uri}-${SortOrder.Asc}`}>{t('shop:filters.name-a-to-z')}</option>
          <option value={`${SortKey.Uri}-${SortOrder.Desc}`}>{t('shop:filters.name-z-to-a')}</option>
        </Select>
      </Field>
    </div>
  );
};
