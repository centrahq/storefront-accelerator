'use client';

import {
  Checkbox,
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
import { CheckIcon } from '@heroicons/react/16/solid';
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useQueryStates } from 'nuqs';
import { useTransition } from 'react';

import { Spinner } from '@/components/Spinner';
import { useTranslation } from '@/features/i18n/useTranslation/client';
import { FilterKey } from '@/lib/centra/constants';
import { ProductsQuery, SortKey, SortOrder } from '@gql/graphql';

import { productsFilterParsers } from '../productListSearchParams';

type Filter = NonNullable<ProductsQuery['displayItems']['filters']>[number];

type ProductFilter<T extends Filter['values'][number]['__typename']> = Omit<Filter, 'values'> & {
  values: Extract<Filter['values'][number], { __typename: T }>[];
};

export const ProductFiltersSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-wrap justify-between">
      <div className="bg-mono-500 h-10 w-80 rounded-sm" />
      <div className="bg-mono-500 ml-auto h-8 w-56 rounded-sm" />
    </div>
  );
};

export const ProductFilters = ({ filters }: { filters: Filter[] }) => {
  const [isLoading, startTransition] = useTransition();
  const [{ sort, brands, sizes, onlyAvailable: availableOnly, collections }, setFilters] = useQueryStates(
    productsFilterParsers,
    {
      shallow: false,
      startTransition,
    },
  );
  const { t } = useTranslation(['shop']);

  const brandFilter = filters.find(
    (filter): filter is ProductFilter<'BrandFilterValue'> => filter.key === FilterKey.Brands,
  );
  const sizeFilter = filters.find(
    (filter): filter is ProductFilter<'SizeNameFilterValue'> => filter.key === FilterKey.Sizes,
  );
  const collectionFilter = filters.find(
    (filter): filter is ProductFilter<'CollectionFilterValue'> => filter.key === FilterKey.Collections,
  );

  const brandOptions = brandFilter?.values.filter((filter) => Boolean(filter.name)) ?? [];
  const sizeOptions = sizeFilter?.values.filter((filter) => Boolean(filter.value) && filter.filterCount > 0) ?? [];
  const collectionOptions = collectionFilter?.values.filter((filter) => Boolean(filter.name)) ?? [];

  const hasActiveFilters =
    brands.length > 0 || sizes.length > 0 || collections.length > 0 || availableOnly || sort !== '';

  return (
    <div className="flex flex-wrap justify-between">
      {brandOptions.length > 0 && sizeOptions.length > 0 ? (
        <Fieldset>
          <div className="flex flex-wrap gap-4">
            <Legend className="text-mono-500 flex items-center gap-2 font-medium">
              {isLoading ? <Spinner className="size-5" /> : <FunnelIcon className="size-5" aria-hidden="true" />}
              <span>{t('shop:filters.filter-by')}</span>
            </Legend>
            {brandOptions.length > 1 && (
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
                  <ChevronDownIcon className="text-mono-900 size-4" aria-hidden="true" />
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom start"
                  className="border-mono-200 bg-mono-0/95 min-w-[var(--button-width)] rounded-xs border p-1 shadow-xs [--anchor-gap:var(--spacing-1)] focus:outline-hidden"
                >
                  {brandOptions.map((filter) => (
                    <ListboxOption
                      key={filter.value}
                      value={filter.value}
                      className="group data-focus:bg-mono-300/95 flex cursor-default items-center gap-2 rounded-xs px-3 py-2 text-sm select-none data-disabled:opacity-50"
                      disabled={filter.filterCount === 0}
                    >
                      <div className="border-mono-900 flex size-4 items-center justify-center rounded-full border">
                        <CheckIcon
                          className="text-mono-900 invisible size-3 group-data-selected:visible"
                          aria-hidden="true"
                        />
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
                  <ChevronDownIcon className="text-mono-900 size-4" aria-hidden="true" />
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom start"
                  className="border-mono-200 bg-mono-0/95 min-w-[var(--button-width)] rounded-xs border p-1 shadow-xs [--anchor-gap:var(--spacing-1)] focus:outline-hidden"
                >
                  {sizeOptions.map((filter) => (
                    <ListboxOption
                      key={filter.value}
                      value={filter.value}
                      className="group data-focus:bg-mono-300/95 flex cursor-default items-center gap-2 rounded-xs px-3 py-2 text-sm select-none data-disabled:opacity-50"
                      disabled={filter.filterCount === 0}
                    >
                      <div className="border-mono-900 flex size-4 items-center justify-center rounded-full border">
                        <CheckIcon
                          className="text-mono-900 invisible size-3 group-data-selected:visible"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        {filter.value} ({filter.filterCount})
                      </div>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            )}
            {collectionOptions.length > 1 && (
              <Listbox
                value={collections}
                onChange={(newCollections) => {
                  void setFilters((old) => ({
                    ...old,
                    collections: newCollections,
                    page: 1,
                  }));
                }}
                multiple
              >
                <ListboxButton className="bg-mono-0/5 flex items-center justify-between gap-3 rounded-lg px-3 py-2">
                  <span>{t('shop:filters.collection')}</span>
                  <ChevronDownIcon className="text-mono-900 size-4" aria-hidden="true" />
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom start"
                  className="border-mono-200 bg-mono-0/95 min-w-[var(--button-width)] rounded-xs border p-1 shadow-xs [--anchor-gap:var(--spacing-1)] focus:outline-hidden"
                >
                  {collectionOptions.map((filter) => (
                    <ListboxOption
                      key={filter.value}
                      value={filter.value}
                      className="group data-focus:bg-mono-300/95 flex cursor-default items-center gap-2 rounded-xs px-3 py-2 text-sm select-none data-disabled:opacity-50"
                      disabled={filter.filterCount === 0}
                    >
                      <div className="border-mono-900 flex size-4 items-center justify-center rounded-full border">
                        <CheckIcon
                          className="text-mono-900 invisible size-3 group-data-selected:visible"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        {filter.name} ({filter.filterCount})
                      </div>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
            )}
            <Field className="flex items-center gap-3">
              <Checkbox
                checked={availableOnly}
                onChange={(checked) => {
                  void setFilters((old) => ({ ...old, onlyAvailable: checked, page: 1 }));
                }}
                className="group border-mono-500 flex size-5 items-center justify-center rounded-sm border"
              >
                <CheckIcon className="hidden size-4 fill-black group-data-checked:block" aria-hidden="true" />
              </Checkbox>
              <Label>{t('shop:filters.only-available')}</Label>
            </Field>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  void setFilters({
                    brands: [],
                    sizes: [],
                    collections: [],
                    onlyAvailable: false,
                    sort: '',
                    page: 1,
                  });
                }}
                className="text-mono-600 hover:text-mono-900 text-sm underline underline-offset-2"
              >
                {t('shop:filters.clear-filters')}
              </button>
            )}
          </div>
        </Fieldset>
      ) : (
        <div />
      )}
      <Field className="ml-auto flex items-center gap-3 py-2">
        <Label className="text-mono-500 font-medium">{t('shop:filters.sort-by')}</Label>
        <div className="relative flex items-center">
          <Select
            className="block w-full appearance-none bg-transparent pr-6 pl-1 font-medium"
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
          <ChevronDownIcon className="pointer-events-none absolute right-1 size-4" aria-hidden="true" />
        </div>
      </Field>
    </div>
  );
};
